import { Router, type Request, type Response } from "express";
import type { IssueCreateInput } from "../../shared/portal.js";
import { ensureDatabaseConfigured, queryOrThrow } from "../lib/db.js";

const router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();
    const result = await queryOrThrow<{
      id: string;
      title: string;
      description: string;
      provider_id: string | null;
      extension_version: string | null;
      created_at: string;
      status: string;
      votes: string;
      has_logs: boolean;
    }>(
      `
        select
          i.id,
          i.title,
          i.description,
          coalesce(i.provider_id, 'system') as provider_id,
          coalesce(i.extension_version, 'unknown') as extension_version,
          i.created_at,
          i.status,
          (coalesce(count(distinct v.id), 0) + greatest(i.priority_score, 0))::text as votes,
          (count(distinct l.id) > 0) as has_logs
        from issues i
        left join issue_votes v on v.issue_id = i.id
        left join issue_logs l on l.issue_id = i.id
        group by i.id
        order by (coalesce(count(distinct v.id), 0) + greatest(i.priority_score, 0)) desc, i.created_at desc
        limit 50
      `
    );

    res.json({
      ok: true,
      items: result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        providerId: row.provider_id,
        extensionVersion: row.extension_version,
        votes: Number(row.votes),
        status: row.status,
        createdAt: row.created_at,
        reporter: "user",
        hasLogs: row.has_logs,
      })),
    });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();
    const issueId = req.params.id;
    const issueResult = await queryOrThrow<{
      id: string;
      title: string;
      description: string;
      provider_id: string | null;
      extension_version: string | null;
      created_at: string;
      status: string;
      reproduction_steps: string | null;
      admin_note: string | null;
      votes: string;
    }>(
      `
        select
          i.id,
          i.title,
          i.description,
          i.provider_id,
          i.extension_version,
          i.created_at,
          i.status,
          i.reproduction_steps,
          i.admin_note,
          (coalesce(count(v.id), 0) + greatest(i.priority_score, 0))::text as votes
        from issues i
        left join issue_votes v on v.issue_id = i.id
        where i.id = $1
        group by i.id
        limit 1
      `,
      [issueId]
    );

    if (!issueResult.rows[0]) {
      res.status(404).json({ ok: false, error: "问题不存在" });
      return;
    }

    const logsResult = await queryOrThrow<{
      id: string;
      file_name: string;
      file_size: string;
    }>(
      `
        select id, file_name, file_size::text
        from issue_logs
        where issue_id = $1
        order by created_at desc
      `,
      [issueId]
    );

    const row = issueResult.rows[0];
    res.json({
      ok: true,
      item: {
        id: row.id,
        title: row.title,
        description: row.description,
        providerId: row.provider_id || "system",
        extensionVersion: row.extension_version || "unknown",
        votes: Number(row.votes),
        status: row.status,
        createdAt: row.created_at,
        reporter: "user",
        hasLogs: logsResult.rows.length > 0,
        reproductionSteps: row.reproduction_steps || "",
        adminNote: row.admin_note || "",
        relatedRegion: "Unknown",
        logFiles: logsResult.rows.map((log) => ({
          id: log.id,
          fileName: log.file_name,
          size: `${Math.round(Number(log.file_size) / 1024) || 0} KB`,
        })),
      },
    });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();
    const body = req.body as IssueCreateInput;

    if (!body?.title || !body?.description) {
      res.status(400).json({ ok: false, error: "标题和描述不能为空" });
      return;
    }

    const deviceResult = body.deviceId
      ? await queryOrThrow<{ id: string }>(
          `
            insert into devices (device_id)
            values ($1)
            on conflict (device_id)
            do update set last_seen_at = now()
            returning id
          `,
          [body.deviceId]
        )
      : null;

    const result = await queryOrThrow<{ id: string }>(
      `
        insert into issues (device_id, title, description, provider_id, extension_version, reproduction_steps)
        values ($1, $2, $3, $4, $5, $6)
        returning id
      `,
      [
        deviceResult?.rows?.[0]?.id || null,
        body.title,
        body.description,
        body.providerId || null,
        body.extensionVersion || null,
        body.reproductionSteps || null,
      ]
    );

    res.json({ ok: true, issueId: result.rows[0].id });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

router.post("/:id/vote", async (req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();
    const issueId = req.params.id;
    const userId = String(req.body?.userId || "").trim() || "00000000-0000-0000-0000-000000000001";

    const userResult = await queryOrThrow<{ id: string }>(
      `
        insert into users (id, email, name, role)
        values ($1::uuid, $2, $3, 'user')
        on conflict (email) do update set name = excluded.name
        returning id
      `,
      [userId, `${userId}@ccwebai.local`, "Issue Supporter"]
    );

    await queryOrThrow(
      `
        insert into issue_votes (issue_id, user_id)
        values ($1::uuid, $2::uuid)
        on conflict (issue_id, user_id) do nothing
      `,
      [issueId, userResult.rows[0].id]
    );

    const countResult = await queryOrThrow<{ total: string }>(
      `
        select (coalesce(count(v.id), 0) + greatest(i.priority_score, 0))::text as total
        from issues i
        left join issue_votes v on v.issue_id = i.id
        where i.id = $1
        group by i.id
      `,
      [issueId]
    );

    res.json({ ok: true, totalVotes: Number(countResult.rows[0]?.total || 0) });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

export default router;

import { Router, type Request, type Response } from "express";
import { ensureDatabaseConfigured, queryOrThrow } from "../lib/db.js";

const router = Router();

type ValueRow = { label: string; value: string };
type TrendRow = { day: string; value: string };

async function readTrend(sql: string) {
  const result = await queryOrThrow<TrendRow>(sql);
  return result.rows.map((row) => ({
    date: row.day,
    value: Number(row.value),
  }));
}

router.get("/overview", async (_req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();

    const counts = await queryOrThrow<{
      total_installs: string;
      active_devices: string;
      conversations_7d: string;
      countries_covered: string;
    }>(
      `
        select
          (select count(*) from installations) as total_installs,
          (select count(distinct device_id) from usage_events where occurred_at >= now() - interval '7 day') as active_devices,
          (select count(*) from usage_events where occurred_at >= now() - interval '7 day' and event_type in ('request_started','request_succeeded')) as conversations_7d,
          (
            select count(distinct region)
            from usage_events
            where region is not null and length(trim(region)) > 0
          ) as countries_covered
      `
    );

    const installTrend = await readTrend(`
      select to_char(day, 'MM-DD') as day, count(i.id)::text as value
      from generate_series(current_date - interval '6 day', current_date, interval '1 day') as day
      left join installations i on date(i.installed_at) = date(day)
      group by day
      order by day
    `);

    const usageTrend = await readTrend(`
      select to_char(day, 'MM-DD') as day, count(u.id)::text as value
      from generate_series(current_date - interval '6 day', current_date, interval '1 day') as day
      left join usage_events u on date(u.occurred_at) = date(day)
      group by day
      order by day
    `);

    const providerRows = await queryOrThrow<ValueRow>(
      `
        select coalesce(provider_id, 'unknown') as label, count(*)::text as value
        from usage_events
        where provider_id is not null
        group by coalesce(provider_id, 'unknown')
        order by count(*) desc
        limit 6
      `
    );

    const regionRows = await queryOrThrow<ValueRow>(
      `
        select coalesce(region, 'unknown') as label, count(*)::text as value
        from usage_events
        where region is not null
        group by coalesce(region, 'unknown')
        order by count(*) desc
        limit 6
      `
    );

    const versionRows = await queryOrThrow<ValueRow>(
      `
        select coalesce(extension_version, 'unknown') as label, count(*)::text as value
        from installations
        group by coalesce(extension_version, 'unknown')
        order by count(*) desc
        limit 6
      `
    );

    const row = counts.rows[0];
    res.json({
      ok: true,
      metrics: [
        { label: "累计安装量", value: Number(row.total_installs).toLocaleString(), delta: "all time" },
        { label: "7日累计对话数", value: Number(row.conversations_7d).toLocaleString(), delta: "7 days" },
        { label: "7日活跃设备数", value: Number(row.active_devices).toLocaleString(), delta: "7 days" },
        { label: "覆盖全球国家数", value: Number(row.countries_covered).toLocaleString(), delta: "global" },
      ],
      installationTrend: installTrend,
      usageTrend,
      providers: providerRows.rows.map((item) => ({ label: item.label, value: Number(item.value) })),
      regions: regionRows.rows.map((item) => ({ label: item.label, value: Number(item.value) })),
      versions: versionRows.rows.map((item) => ({ label: item.label, value: Number(item.value) })),
    });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

router.get("/installations", async (_req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();
    const items = await readTrend(`
      select to_char(day, 'MM-DD') as day, count(i.id)::text as value
      from generate_series(current_date - interval '29 day', current_date, interval '1 day') as day
      left join installations i on date(i.installed_at) = date(day)
      group by day
      order by day
    `);
    res.json({ ok: true, items });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

router.get("/usage", async (_req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();
    const items = await readTrend(`
      select to_char(day, 'MM-DD') as day, count(u.id)::text as value
      from generate_series(current_date - interval '29 day', current_date, interval '1 day') as day
      left join usage_events u on date(u.occurred_at) = date(day)
      group by day
      order by day
    `);
    res.json({ ok: true, items });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

router.get("/regions", async (_req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();
    const result = await queryOrThrow<ValueRow>(
      `
        select coalesce(region, 'unknown') as label, count(*)::text as value
        from usage_events
        where region is not null
        group by coalesce(region, 'unknown')
        order by count(*) desc
      `
    );
    res.json({
      ok: true,
      items: result.rows.map((item) => ({ label: item.label, value: Number(item.value) })),
    });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

router.get("/issues", async (_req: Request, res: Response): Promise<void> => {
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
          (coalesce(count(v.id), 0) + greatest(i.priority_score, 0))::text as votes
        from issues i
        left join issue_votes v on v.issue_id = i.id
        group by i.id
        order by (coalesce(count(v.id), 0) + greatest(i.priority_score, 0)) desc, i.created_at desc
      `
    );
    res.json({
      ok: true,
      items: result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        providerId: row.provider_id || "system",
        extensionVersion: row.extension_version || "unknown",
        votes: Number(row.votes),
        status: row.status,
        createdAt: row.created_at,
        reporter: "user",
        hasLogs: false,
      })),
    });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

export default router;

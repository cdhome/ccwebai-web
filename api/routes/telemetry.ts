import { Router, type Request, type Response } from "express";
import type { TelemetryInstallInput, TelemetryUsageInput } from "../../shared/portal.js";
import { ensureDatabaseConfigured, queryOrThrow } from "../lib/db.js";

const router = Router();

router.post("/install", async (req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();
    const body = req.body as TelemetryInstallInput;

    if (!body?.deviceId || !body?.extensionVersion) {
      res.status(400).json({ ok: false, error: "缺少 deviceId 或 extensionVersion" });
      return;
    }

    const deviceResult = await queryOrThrow<{ id: string }>(
      `
        insert into devices (device_id, first_language, first_timezone, latest_extension_version)
        values ($1, $2, $3, $4)
        on conflict (device_id)
        do update set
          last_seen_at = now(),
          latest_extension_version = excluded.latest_extension_version
        returning id
      `,
      [body.deviceId, body.language || null, body.timezone || null, body.extensionVersion]
    );

    const installResult = await queryOrThrow<{ id: string }>(
      `
        insert into installations (device_id, extension_version, browser, language, timezone, source, installed_at)
        values ($1, $2, $3, $4, $5, $6, $7)
        returning id
      `,
      [
        deviceResult.rows[0].id,
        body.extensionVersion,
        body.browser || null,
        body.language || null,
        body.timezone || null,
        body.source || "unknown",
        body.installedAt || new Date().toISOString(),
      ]
    );

    res.json({ ok: true, installId: installResult.rows[0].id });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

router.post("/usage", async (req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();
    const body = req.body as TelemetryUsageInput;

    if (!body?.deviceId || !body?.eventType) {
      res.status(400).json({ ok: false, error: "缺少 deviceId 或 eventType" });
      return;
    }

    const deviceResult = await queryOrThrow<{ id: string }>(
      `
        insert into devices (device_id, latest_extension_version, latest_region)
        values ($1, $2, $3)
        on conflict (device_id)
        do update set
          last_seen_at = now(),
          latest_extension_version = excluded.latest_extension_version,
          latest_region = coalesce(excluded.latest_region, devices.latest_region)
        returning id
      `,
      [body.deviceId, body.extensionVersion || null, body.region || null]
    );

    await queryOrThrow(
      `
        insert into usage_events (device_id, event_type, provider_id, model, extension_version, region, metadata, occurred_at)
        values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
      `,
      [
        deviceResult.rows[0].id,
        body.eventType,
        body.providerId || null,
        body.model || null,
        body.extensionVersion || null,
        body.region || null,
        JSON.stringify(body.metadata || {}),
        body.occurredAt || new Date().toISOString(),
      ]
    );

    res.json({ ok: true });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

export default router;

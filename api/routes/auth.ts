import { Router, type Request, type Response } from "express";
import { config } from "../lib/config.js";
import { clearSessionCookie, getRequestSession, setSessionCookie } from "../lib/auth.js";
import { ensureDatabaseConfigured, queryOrThrow } from "../lib/db.js";

const router = Router();

function getSafeNext(value: unknown): string {
  const next = String(value || "").trim();
  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}

function encodeState(next: string): string {
  return Buffer.from(JSON.stringify({ next }), "utf8").toString("base64url");
}

function decodeState(value: unknown): string {
  try {
    const parsed = JSON.parse(Buffer.from(String(value || ""), "base64url").toString("utf8")) as {
      next?: string;
    };
    return getSafeNext(parsed?.next);
  } catch {
    return "/";
  }
}

router.get("/session", async (req: Request, res: Response): Promise<void> => {
  const session = getRequestSession(req);
  res.json({
    ok: true,
    session,
    googleReady: Boolean(config.googleClientId && config.googleClientSecret),
  });
});

router.get("/google-url", async (req: Request, res: Response): Promise<void> => {
  const next = getSafeNext(req.query.next);
  if (!config.googleClientId || !config.googleRedirectUri) {
    res.json({
      ok: true,
      configured: false,
      url: "",
      message: "Google OAuth 尚未配置，当前阶段先保留接入位。",
    });
    return;
  }

  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: config.googleRedirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state: encodeState(next),
  });

  res.json({
    ok: true,
    configured: true,
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  });
});

router.get("/google/callback", async (req: Request, res: Response): Promise<void> => {
  const next = decodeState(req.query.state);
  const redirectBase = String(config.appBaseUrl || "/").replace(/\/+$/, "");

  try {
    ensureDatabaseConfigured();

    if (!config.googleClientId || !config.googleClientSecret || !config.googleRedirectUri) {
      res.redirect(`${redirectBase}/login?error=${encodeURIComponent("Google OAuth 尚未配置")}`);
      return;
    }

    const code = String(req.query.code || "").trim();
    if (!code) {
      res.redirect(`${redirectBase}/login?error=${encodeURIComponent("缺少 Google 回调 code")}`);
      return;
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.googleClientId,
        client_secret: config.googleClientSecret,
        redirect_uri: config.googleRedirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenJson = (await tokenResponse.json()) as {
      access_token?: string;
      error_description?: string;
    };

    if (!tokenResponse.ok || !tokenJson.access_token) {
      res.redirect(
        `${redirectBase}/login?error=${encodeURIComponent(
          tokenJson.error_description || "Google token 交换失败"
        )}`
      );
      return;
    }

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
      },
    });

    const profile = (await profileResponse.json()) as {
      email?: string;
      name?: string;
      picture?: string;
    };

    const email = String(profile.email || "").trim().toLowerCase();
    if (!profileResponse.ok || !email) {
      res.redirect(`${redirectBase}/login?error=${encodeURIComponent("Google 用户信息读取失败")}`);
      return;
    }

    const defaultRole = config.adminEmails.includes(email) ? "admin" : "user";
    const userResult = await queryOrThrow<{
      id: string;
      email: string;
      name: string;
      avatar_url: string | null;
      role: string;
    }>(
      `
        insert into users (email, name, avatar_url, role)
        values ($1, $2, $3, $4)
        on conflict (email) do update
        set
          name = excluded.name,
          avatar_url = excluded.avatar_url,
          role = case
            when users.role in ('admin', 'super_admin') or excluded.role = 'admin' then 'admin'
            else users.role
          end
        returning id, email, name, avatar_url, role
      `,
      [email, String(profile.name || email), String(profile.picture || ""), defaultRole]
    );

    const user = userResult.rows[0];
    setSessionCookie(res, {
      userId: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url || "",
      role: user.role,
    });

    res.redirect(`${redirectBase}${next}`);
  } catch (error) {
    res.redirect(
      `${redirectBase}/login?error=${encodeURIComponent(String((error as Error)?.message || error))}`
    );
  }
});

router.post("/logout", async (_req: Request, res: Response): Promise<void> => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

export default router;

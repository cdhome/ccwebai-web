import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

const SESSION_COOKIE_NAME = "ccwebai_session";
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const ADMIN_ROLES = new Set(["admin", "super_admin"]);

export type SessionUser = {
  userId: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: string;
  isAdmin: boolean;
};

type StoredSession = {
  userId: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: string;
  exp: number;
};

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string): string {
  return crypto.createHmac("sha256", config.sessionSecret).update(value).digest("base64url");
}

function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.has(String(role || "").trim().toLowerCase());
}

function parseCookies(req: Request): Record<string, string> {
  const raw = String(req.headers.cookie || "");
  if (!raw) return {};

  return raw.split(";").reduce<Record<string, string>>((acc, chunk) => {
    const [key, ...rest] = chunk.split("=");
    if (!key) return acc;
    acc[key.trim()] = decodeURIComponent(rest.join("=").trim());
    return acc;
  }, {});
}

function serializeSession(session: Omit<SessionUser, "isAdmin">): string {
  const payload: StoredSession = {
    userId: session.userId,
    email: session.email,
    name: session.name,
    avatarUrl: session.avatarUrl,
    role: session.role,
    exp: Date.now() + SESSION_MAX_AGE_MS,
  };

  const encoded = toBase64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

function deserializeSession(token: string): SessionUser | null {
  const [encodedPayload, signature] = String(token || "").split(".");
  if (!encodedPayload || !signature) return null;
  if (sign(encodedPayload) !== signature) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as StoredSession;
    if (!payload?.userId || !payload?.email || !payload?.exp || payload.exp < Date.now()) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      avatarUrl: payload.avatarUrl || "",
      role: payload.role || "user",
      isAdmin: isAdminRole(payload.role || "user"),
    };
  } catch {
    return null;
  }
}

function isSecureCookie(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    (config.appBaseUrl.startsWith("https://") || config.publicSiteUrl.startsWith("https://"))
  );
}

export function setSessionCookie(res: Response, session: Omit<SessionUser, "isAdmin">): void {
  res.cookie(SESSION_COOKIE_NAME, serializeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
  });
}

export function clearSessionCookie(res: Response): void {
  res.cookie(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    maxAge: 0,
  });
}

export function readSession(req: Request): SessionUser | null {
  const cookies = parseCookies(req);
  return deserializeSession(cookies[SESSION_COOKIE_NAME] || "");
}

export function attachSession(req: Request, _res: Response, next: NextFunction): void {
  req.ccwebaiSession = readSession(req);
  next();
}

export function getRequestSession(req: Request): SessionUser | null {
  return req.ccwebaiSession ?? readSession(req);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const session = getRequestSession(req);
  if (!session) {
    res.status(401).json({ ok: false, error: "请先登录超管账号" });
    return;
  }

  if (!session.isAdmin) {
    res.status(403).json({ ok: false, error: "当前账号没有后台权限" });
    return;
  }

  req.ccwebaiSession = session;
  next();
}

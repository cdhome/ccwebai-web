const rawSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || "https://www.ccwebai.com";

export const PUBLIC_SITE_URL = rawSiteUrl.replace(/\/+$/, "");

export function buildPublicSiteUrl(path = "/") {
  const nextPath = String(path || "/").trim();
  if (!nextPath || nextPath === "/") return `${PUBLIC_SITE_URL}/`;
  if (/^https?:\/\//i.test(nextPath)) return nextPath;
  return `${PUBLIC_SITE_URL}/${nextPath.replace(/^\/+/, "")}`;
}

export const DOCS_PATH = "/docs";
export const ISSUE_SUBMIT_PATH = "/issues/new";

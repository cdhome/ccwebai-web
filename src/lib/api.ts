import type {
  AdminOverview,
  IssueCreateInput,
  IssueDetail,
  IssueItem,
  NativeHostReleaseItem,
  PortalSession,
} from "../../shared/portal";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || `Request failed: ${response.status}`);
    } catch {
      throw new Error(errorText || `Request failed: ${response.status}`);
    }
  }

  return response.json() as Promise<T>;
}

export function getOverview() {
  return request<AdminOverview & { ok: boolean }>("/api/admin/overview");
}

export function getIssues() {
  return request<{ ok: boolean; items: IssueItem[] }>("/api/issues");
}

export function getIssueDetail(issueId: string) {
  return request<{ ok: boolean; item: IssueDetail }>(`/api/issues/${issueId}`);
}

export function createIssue(payload: IssueCreateInput) {
  return request<{ ok: boolean; issueId: string }>("/api/issues", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function voteIssue(issueId: string) {
  return request<{ ok: boolean; totalVotes: number }>(`/api/issues/${issueId}/vote`, {
    method: "POST",
    body: JSON.stringify({ value: 1 }),
  });
}

export function getAuthSession() {
  return request<{ ok: boolean; session: PortalSession | null; googleReady: boolean }>(
    "/api/auth/session"
  );
}

export function getGoogleLoginUrl(nextPath = "/") {
  const search = new URLSearchParams({ next: nextPath });
  return request<{ ok: boolean; configured: boolean; url: string; message?: string }>(
    `/api/auth/google-url?${search.toString()}`
  );
}

export function logoutAuthSession() {
  return request<{ ok: boolean }>("/api/auth/logout", {
    method: "POST",
  });
}

export type NativeHostRelease = {
  ok: boolean;
  available: boolean;
  message?: string;
  latest: NativeHostReleaseItem | null;
};

export function getNativeHostRelease() {
  return request<NativeHostRelease>("/api/releases/native-host/latest");
}

export function getAdminNativeHostReleases() {
  return request<{ ok: boolean; items: NativeHostReleaseItem[] }>("/api/releases/admin/native-host");
}

export function createAdminNativeHostRelease(payload: {
  version: string;
  baseUrl: string;
  notes: string;
  isActive: boolean;
}) {
  return request<{ ok: boolean; item: NativeHostReleaseItem }>("/api/releases/admin/native-host", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function activateAdminNativeHostRelease(releaseId: string) {
  return request<{ ok: boolean; item: NativeHostReleaseItem }>(
    `/api/releases/admin/native-host/${releaseId}/activate`,
    {
      method: "POST",
    }
  );
}

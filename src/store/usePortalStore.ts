import { create } from "zustand";
import type {
  AdminOverview,
  IssueDetail,
  IssueItem,
  NativeHostReleaseItem,
  PortalSession,
} from "../../shared/portal";
import {
  activateAdminNativeHostRelease,
  createIssue,
  createAdminNativeHostRelease,
  getAdminNativeHostReleases,
  getAuthSession,
  getGoogleLoginUrl,
  getIssueDetail,
  getIssues,
  logoutAuthSession,
  getOverview,
  voteIssue,
} from "@/lib/api";

type PortalStore = {
  overview: AdminOverview | null;
  issues: IssueItem[];
  issueDetail: IssueDetail | null;
  session: PortalSession | null;
  authChecked: boolean;
  googleLoginUrl: string;
  googleConfigured: boolean;
  releases: NativeHostReleaseItem[];
  loading: boolean;
  error: string;
  loadSession: () => Promise<PortalSession | null>;
  loadOverview: () => Promise<void>;
  loadIssues: () => Promise<void>;
  loadIssueDetail: (issueId: string) => Promise<void>;
  loadGoogleLogin: (nextPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  submitIssue: (payload: {
    title: string;
    description: string;
    providerId: string;
    extensionVersion: string;
    deviceId: string;
    reproductionSteps: string;
  }) => Promise<string>;
  supportIssue: (issueId: string) => Promise<void>;
  loadAdminReleases: () => Promise<void>;
  createAdminRelease: (payload: {
    version: string;
    baseUrl: string;
    notes: string;
    isActive: boolean;
  }) => Promise<void>;
  activateAdminRelease: (releaseId: string) => Promise<void>;
};

export const usePortalStore = create<PortalStore>((set, get) => ({
  overview: null,
  issues: [],
  issueDetail: null,
  session: null,
  authChecked: false,
  googleLoginUrl: "",
  googleConfigured: false,
  releases: [],
  loading: false,
  error: "",
  loadSession: async () => {
    try {
      const data = await getAuthSession();
      set({ session: data.session, authChecked: true });
      return data.session;
    } catch (error) {
      set({ session: null, authChecked: true, error: String(error) });
      return null;
    }
  },
  loadOverview: async () => {
    set({ loading: true, error: "" });
    try {
      const data = await getOverview();
      set({ overview: data, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  loadIssues: async () => {
    set({ loading: true, error: "" });
    try {
      const data = await getIssues();
      set({ issues: data.items, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  loadIssueDetail: async (issueId: string) => {
    set({ loading: true, error: "" });
    try {
      const data = await getIssueDetail(issueId);
      set({ issueDetail: data.item, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  loadGoogleLogin: async (nextPath = "/") => {
    try {
      const data = await getGoogleLoginUrl(nextPath);
      set({ googleLoginUrl: data.url, googleConfigured: data.configured });
    } catch (error) {
      set({ error: String(error) });
    }
  },
  logout: async () => {
    await logoutAuthSession();
    set({ session: null, authChecked: true });
  },
  submitIssue: async (payload) => {
    set({ loading: true, error: "" });
    try {
      const data = await createIssue(payload);
      await get().loadIssues();
      set({ loading: false });
      return data.issueId;
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },
  supportIssue: async (issueId: string) => {
    await voteIssue(issueId);
    await get().loadIssues();
    if (get().issueDetail?.id === issueId) {
      await get().loadIssueDetail(issueId);
    }
  },
  loadAdminReleases: async () => {
    set({ loading: true, error: "" });
    try {
      const data = await getAdminNativeHostReleases();
      set({ releases: data.items, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  createAdminRelease: async (payload) => {
    set({ loading: true, error: "" });
    try {
      await createAdminNativeHostRelease(payload);
      await get().loadAdminReleases();
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },
  activateAdminRelease: async (releaseId: string) => {
    set({ loading: true, error: "" });
    try {
      await activateAdminNativeHostRelease(releaseId);
      await get().loadAdminReleases();
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },
}));

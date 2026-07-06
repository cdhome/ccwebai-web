export type OverviewMetric = {
  label: string;
  value: string;
  delta: string;
};

export type TrendPoint = {
  date: string;
  value: number;
};

export type BreakdownItem = {
  label: string;
  value: number;
};

export type IssueStatus = "open" | "triaging" | "planned" | "resolved";

export type IssueItem = {
  id: string;
  title: string;
  description: string;
  providerId: string;
  extensionVersion: string;
  votes: number;
  status: IssueStatus;
  createdAt: string;
  reporter: string;
  hasLogs: boolean;
};

export type IssueDetail = IssueItem & {
  reproductionSteps: string;
  adminNote: string;
  relatedRegion: string;
  logFiles: Array<{
    id: string;
    fileName: string;
    size: string;
  }>;
};

export type AdminOverview = {
  metrics: OverviewMetric[];
  installationTrend: TrendPoint[];
  usageTrend: TrendPoint[];
  regions: BreakdownItem[];
  providers: BreakdownItem[];
  versions: BreakdownItem[];
};

export type PortalSession = {
  userId: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: string;
  isAdmin: boolean;
};

export type NativeHostReleaseItem = {
  id: string;
  version: string;
  baseUrl: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  downloads: Record<string, string>;
};

export type AdminListResponse = {
  items: BreakdownItem[];
};

export type IssuesResponse = {
  items: IssueItem[];
};

export type IssueCreateInput = {
  title: string;
  description: string;
  providerId: string;
  extensionVersion: string;
  deviceId: string;
  reproductionSteps: string;
};

export type TelemetryInstallInput = {
  deviceId: string;
  extensionVersion: string;
  browser: string;
  language: string;
  timezone?: string;
  installedAt: string;
  source?: string;
};

export type TelemetryUsageInput = {
  deviceId: string;
  extensionVersion: string;
  eventType: string;
  providerId?: string;
  model?: string;
  region?: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
};

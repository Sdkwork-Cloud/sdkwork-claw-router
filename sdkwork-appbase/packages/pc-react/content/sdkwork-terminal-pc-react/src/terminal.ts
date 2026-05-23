export type SdkworkTerminalShell = "bash" | "cmd" | "powershell" | "zsh";
export type SdkworkTerminalRiskPosture = "elevated" | "restricted" | "standard";
export type SdkworkTerminalSessionState = "error" | "idle" | "running" | "stopped";
export type SdkworkTerminalRuntimeHealth = "degraded" | "healthy" | "offline";
export type SdkworkTerminalPermissionReadiness = "blocked" | "ready" | "review";
export type SdkworkTerminalSortBy = "health" | "history" | "name" | "recent";

export interface SdkworkTerminalProfile {
  defaultCwd: string;
  id: string;
  name: string;
  persistent: boolean;
  riskPosture: SdkworkTerminalRiskPosture;
  shell: SdkworkTerminalShell;
}

export interface SdkworkTerminalHistoryEntry {
  command: string;
  cwd: string;
  durationMs: number;
  executedAt: string;
  exitCode: number | null;
  id: string;
}

export interface SdkworkTerminalSession {
  history: SdkworkTerminalHistoryEntry[];
  id: string;
  lastActivityAt: string;
  permissionReadiness: SdkworkTerminalPermissionReadiness;
  profileId: string;
  route: string;
  runtimeHealth: SdkworkTerminalRuntimeHealth;
  state: SdkworkTerminalSessionState;
  title: string;
  workingDirectory: string;
}

export interface SdkworkTerminalWorkspaceContext {
  isAuthenticated: boolean;
  workspaceId?: string;
}

export interface SdkworkTerminalFilterOption<T extends string> {
  count: number;
  id: T | "all";
  label: string;
}

export interface SdkworkTerminalSortOption {
  id: SdkworkTerminalSortBy;
  label: string;
}

export interface SdkworkTerminalWorkspaceFilters {
  healthOptions: SdkworkTerminalFilterOption<SdkworkTerminalRuntimeHealth>[];
  profileOptions: SdkworkTerminalFilterOption<string>[];
  sortOptions: SdkworkTerminalSortOption[];
  stateOptions: SdkworkTerminalFilterOption<SdkworkTerminalSessionState>[];
}

export interface SdkworkTerminalWorkspaceSummary {
  errorSessions: number;
  historyEntries: number;
  offlineRuntimes: number;
  profileCount: number;
  readySessions: number;
  runningSessions: number;
  sessionCount: number;
}

export interface SdkworkTerminalWorkspaceData {
  context: SdkworkTerminalWorkspaceContext;
  filters: SdkworkTerminalWorkspaceFilters;
  profiles: SdkworkTerminalProfile[];
  sessions: SdkworkTerminalSession[];
  summary: SdkworkTerminalWorkspaceSummary;
}

export interface SdkworkTerminalCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: string;
  title: string;
}

export interface SdkworkTerminalWorkspaceManifest extends SdkworkTerminalCapabilityManifest {
  capability: "terminal";
  routePath: string;
}

export interface CreateTerminalWorkspaceManifestOptions
  extends Partial<
    Pick<SdkworkTerminalCapabilityManifest, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkTerminalRouteIntent {
  focusWindow: boolean;
  profileId?: string;
  route: string;
  sessionId?: string;
  source: "terminal-workspace";
  state?: SdkworkTerminalSessionState;
  type: "terminal-route-intent";
}

export interface CreateTerminalRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  profileId?: string;
  sessionId?: string;
  state?: SdkworkTerminalSessionState;
}

export interface CreateEmptySdkworkTerminalWorkspaceOptions {
  context?: Partial<SdkworkTerminalWorkspaceContext>;
  profiles?: readonly SdkworkTerminalProfile[];
  sessions?: readonly SdkworkTerminalSession[];
}

export interface FilterSdkworkTerminalSessionsOptions {
  activeHealth: SdkworkTerminalRuntimeHealth | "all";
  activeProfileId: string;
  activeState: SdkworkTerminalSessionState | "all";
  query: string;
  sortBy: SdkworkTerminalSortBy;
}

const STATE_LABELS: Record<SdkworkTerminalSessionState, string> = {
  error: "Error",
  idle: "Idle",
  running: "Running",
  stopped: "Stopped",
};

const HEALTH_LABELS: Record<SdkworkTerminalRuntimeHealth, string> = {
  degraded: "Degraded",
  healthy: "Healthy",
  offline: "Offline",
};

const SORT_OPTIONS: SdkworkTerminalSortOption[] = [
  {
    id: "recent",
    label: "Recent",
  },
  {
    id: "health",
    label: "Health",
  },
  {
    id: "history",
    label: "History",
  },
  {
    id: "name",
    label: "Name",
  },
];

const HEALTH_ORDER: Record<SdkworkTerminalRuntimeHealth, number> = {
  healthy: 0,
  degraded: 1,
  offline: 2,
};

const STATE_ORDER: Record<SdkworkTerminalSessionState, number> = {
  running: 0,
  idle: 1,
  stopped: 2,
  error: 3,
};

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/terminal").trim();
  if (!normalized || normalized === "/") {
    return "/terminal";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function countBy<T extends string>(
  values: readonly T[],
): Record<T, number> {
  return values.reduce<Record<T, number>>((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {} as Record<T, number>);
}

export function createDefaultSdkworkTerminalProfiles(): SdkworkTerminalProfile[] {
  return [
    {
      defaultCwd: "/workspace",
      id: "profile-workspace-shell",
      name: "Workspace Shell",
      persistent: true,
      riskPosture: "standard",
      shell: "bash",
    },
    {
      defaultCwd: "/workspace/release",
      id: "profile-release-powershell",
      name: "Release PowerShell",
      persistent: true,
      riskPosture: "elevated",
      shell: "powershell",
    },
    {
      defaultCwd: "/workspace/sandbox",
      id: "profile-sandbox",
      name: "Sandbox",
      persistent: false,
      riskPosture: "restricted",
      shell: "zsh",
    },
  ];
}

export function createDefaultSdkworkTerminalSessions(): SdkworkTerminalSession[] {
  return [
    {
      history: [
        {
          command: "pnpm exec vitest run",
          cwd: "/workspace",
          durationMs: 8200,
          executedAt: "2026-04-03T09:10:00.000Z",
          exitCode: 0,
          id: "hist-1",
        },
      ],
      id: "session-workspace-main",
      lastActivityAt: "2026-04-03T09:11:00.000Z",
      permissionReadiness: "ready",
      profileId: "profile-workspace-shell",
      route: "/terminal?sessionId=session-workspace-main",
      runtimeHealth: "healthy",
      state: "running",
      title: "Workspace Main",
      workingDirectory: "/workspace",
    },
    {
      history: [
        {
          command: "git status --short",
          cwd: "/workspace/release",
          durationMs: 350,
          executedAt: "2026-04-03T08:45:00.000Z",
          exitCode: 0,
          id: "hist-2",
        },
        {
          command: "pnpm build",
          cwd: "/workspace/release",
          durationMs: 120000,
          executedAt: "2026-04-03T08:30:00.000Z",
          exitCode: 1,
          id: "hist-3",
        },
      ],
      id: "session-release",
      lastActivityAt: "2026-04-03T08:46:00.000Z",
      permissionReadiness: "review",
      profileId: "profile-release-powershell",
      route: "/terminal?sessionId=session-release",
      runtimeHealth: "degraded",
      state: "idle",
      title: "Release Terminal",
      workingDirectory: "/workspace/release",
    },
    {
      history: [
        {
          command: "curl https://example.org",
          cwd: "/workspace/sandbox",
          durationMs: 550,
          executedAt: "2026-04-02T20:10:00.000Z",
          exitCode: null,
          id: "hist-4",
        },
      ],
      id: "session-sandbox",
      lastActivityAt: "2026-04-02T20:11:00.000Z",
      permissionReadiness: "blocked",
      profileId: "profile-sandbox",
      route: "/terminal?sessionId=session-sandbox",
      runtimeHealth: "offline",
      state: "error",
      title: "Sandbox Session",
      workingDirectory: "/workspace/sandbox",
    },
  ];
}

export function sortSdkworkTerminalSessions(
  sessions: readonly SdkworkTerminalSession[],
  sortBy: SdkworkTerminalSortBy = "recent",
): SdkworkTerminalSession[] {
  return [...sessions].sort((left, right) => {
    if (sortBy === "name") {
      return left.title.localeCompare(right.title);
    }

    if (sortBy === "history") {
      return right.history.length - left.history.length
        || toTimestamp(right.lastActivityAt) - toTimestamp(left.lastActivityAt)
        || left.title.localeCompare(right.title);
    }

    if (sortBy === "health") {
      return (HEALTH_ORDER[left.runtimeHealth] ?? Number.MAX_SAFE_INTEGER)
        - (HEALTH_ORDER[right.runtimeHealth] ?? Number.MAX_SAFE_INTEGER)
        || (STATE_ORDER[left.state] ?? Number.MAX_SAFE_INTEGER)
        - (STATE_ORDER[right.state] ?? Number.MAX_SAFE_INTEGER)
        || toTimestamp(right.lastActivityAt) - toTimestamp(left.lastActivityAt)
        || left.title.localeCompare(right.title);
    }

    return toTimestamp(right.lastActivityAt) - toTimestamp(left.lastActivityAt)
      || (STATE_ORDER[left.state] ?? Number.MAX_SAFE_INTEGER)
      - (STATE_ORDER[right.state] ?? Number.MAX_SAFE_INTEGER)
      || left.title.localeCompare(right.title);
  });
}

export function filterSdkworkTerminalSessions(
  sessions: readonly SdkworkTerminalSession[],
  options: FilterSdkworkTerminalSessionsOptions,
): SdkworkTerminalSession[] {
  const query = normalizeText(options.query);
  const filtered = sessions.filter((session) => {
    if (options.activeProfileId !== "all" && session.profileId !== options.activeProfileId) {
      return false;
    }

    if (options.activeState !== "all" && session.state !== options.activeState) {
      return false;
    }

    if (options.activeHealth !== "all" && session.runtimeHealth !== options.activeHealth) {
      return false;
    }

    if (!query) {
      return true;
    }

    const fields = [
      session.id,
      session.title,
      session.workingDirectory,
      session.profileId,
      ...session.history.map((entry) => entry.command),
    ];

    return fields.some((value) => normalizeText(value).includes(query));
  });

  return sortSdkworkTerminalSessions(filtered, options.sortBy);
}

function buildProfileOptions(
  profiles: readonly SdkworkTerminalProfile[],
  sessions: readonly SdkworkTerminalSession[],
): SdkworkTerminalFilterOption<string>[] {
  const counts = countBy(sessions.map((session) => session.profileId));

  return [
    {
      count: sessions.length,
      id: "all",
      label: "All profiles",
    },
    ...profiles
      .filter((profile) => (counts[profile.id] ?? 0) > 0)
      .map((profile) => ({
        count: counts[profile.id] ?? 0,
        id: profile.id,
        label: profile.name,
      })),
  ];
}

function buildStateOptions(
  sessions: readonly SdkworkTerminalSession[],
): SdkworkTerminalFilterOption<SdkworkTerminalSessionState>[] {
  const counts = countBy(sessions.map((session) => session.state));
  const keys: SdkworkTerminalSessionState[] = ["running", "idle", "stopped", "error"];

  return [
    {
      count: sessions.length,
      id: "all",
      label: "All states",
    },
    ...keys.filter((key) => (counts[key] ?? 0) > 0).map((key) => ({
      count: counts[key] ?? 0,
      id: key,
      label: STATE_LABELS[key],
    })),
  ];
}

function buildHealthOptions(
  sessions: readonly SdkworkTerminalSession[],
): SdkworkTerminalFilterOption<SdkworkTerminalRuntimeHealth>[] {
  const counts = countBy(sessions.map((session) => session.runtimeHealth));
  const keys: SdkworkTerminalRuntimeHealth[] = ["healthy", "degraded", "offline"];

  return [
    {
      count: sessions.length,
      id: "all",
      label: "All health",
    },
    ...keys.filter((key) => (counts[key] ?? 0) > 0).map((key) => ({
      count: counts[key] ?? 0,
      id: key,
      label: HEALTH_LABELS[key],
    })),
  ];
}

export function summarizeSdkworkTerminalWorkspace(
  sessions: readonly SdkworkTerminalSession[],
  profiles: readonly SdkworkTerminalProfile[],
): SdkworkTerminalWorkspaceSummary {
  return sessions.reduce<SdkworkTerminalWorkspaceSummary>(
    (summary, session) => {
      summary.sessionCount += 1;
      summary.historyEntries += session.history.length;

      if (session.state === "running") {
        summary.runningSessions += 1;
      }
      if (session.state === "error") {
        summary.errorSessions += 1;
      }
      if (session.runtimeHealth === "offline") {
        summary.offlineRuntimes += 1;
      }
      if (session.permissionReadiness === "ready") {
        summary.readySessions += 1;
      }

      return summary;
    },
    {
      errorSessions: 0,
      historyEntries: 0,
      offlineRuntimes: 0,
      profileCount: profiles.length,
      readySessions: 0,
      runningSessions: 0,
      sessionCount: 0,
    },
  );
}

export function createEmptySdkworkTerminalWorkspace(
  options: CreateEmptySdkworkTerminalWorkspaceOptions = {},
): SdkworkTerminalWorkspaceData {
  const profiles = options.profiles?.length ? [...options.profiles] : createDefaultSdkworkTerminalProfiles();
  const sessions = options.sessions?.length
    ? sortSdkworkTerminalSessions(options.sessions, "recent")
    : sortSdkworkTerminalSessions(createDefaultSdkworkTerminalSessions(), "recent");

  return {
    context: {
      isAuthenticated: false,
      ...options.context,
    },
    filters: {
      healthOptions: buildHealthOptions(sessions),
      profileOptions: buildProfileOptions(profiles, sessions),
      sortOptions: SORT_OPTIONS,
      stateOptions: buildStateOptions(sessions),
    },
    profiles,
    sessions,
    summary: summarizeSdkworkTerminalWorkspace(sessions, profiles),
  };
}

export function createTerminalWorkspaceManifest({
  description = "Terminal capability for workspace sessions, profiles, command history, and runtime health posture.",
  host,
  id = "sdkwork-terminal",
  packageNames = [
    "@sdkwork/terminal-pc-react",
    "@sdkwork/browser-pc-react",
    "@sdkwork/editor-pc-react",
  ],
  routePath = "/terminal",
  theme,
  title = "Terminal Workspace",
}: CreateTerminalWorkspaceManifestOptions = {}): SdkworkTerminalWorkspaceManifest {
  return {
    capability: "terminal",
    description,
    ...(host ? { host } : {}),
    id,
    packageNames: [...packageNames],
    routePath: normalizeBasePath(routePath),
    ...(theme ? { theme } : {}),
    title,
  };
}

export function createTerminalRouteIntent(
  options: CreateTerminalRouteIntentOptions = {},
): SdkworkTerminalRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const queryParams = new URLSearchParams();
  if (options.profileId) {
    queryParams.set("profileId", options.profileId);
  }
  if (options.state) {
    queryParams.set("state", options.state);
  }
  if (options.sessionId) {
    queryParams.set("sessionId", options.sessionId);
  }

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.profileId ? { profileId: options.profileId } : {}),
    route: queryParams.toString() ? `${basePath}?${queryParams.toString()}` : basePath,
    ...(options.sessionId ? { sessionId: options.sessionId } : {}),
    source: "terminal-workspace",
    ...(options.state ? { state: options.state } : {}),
    type: "terminal-route-intent",
  };
}

export const terminalPackageMeta = {
  architecture: "pc-react",
  domain: "content",
  package: "@sdkwork/terminal-pc-react",
  status: "ready",
} as const;

export type TerminalPackageMeta = typeof terminalPackageMeta;

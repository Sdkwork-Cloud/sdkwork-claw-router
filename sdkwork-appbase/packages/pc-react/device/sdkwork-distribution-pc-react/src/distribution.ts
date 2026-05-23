export type SdkworkDistributionChannelType = "candidate" | "internal" | "preview" | "stable";
export type SdkworkDistributionArtifactStatus = "blocked" | "building" | "missing" | "ready";
export type SdkworkDistributionRiskLevel = "high" | "low" | "medium";
export type SdkworkDistributionMirrorStrategy = "global" | "regional";
export type SdkworkDistributionUpdateSource = "github" | "self-hosted";
export type SdkworkDistributionPlatform = "linux-x64" | "macos-universal" | "windows-arm64" | "windows-x64";
export type SdkworkDistributionRouteSection = "artifacts" | "channels" | "overview";

export interface SdkworkDistributionCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: string;
  title: string;
}

export interface SdkworkDistributionWorkspaceManifest extends SdkworkDistributionCapabilityManifest {
  capability: "distribution";
  routePath: string;
}

export interface CreateDistributionWorkspaceManifestOptions
  extends Partial<
    Pick<SdkworkDistributionCapabilityManifest, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkDistributionRouteIntent {
  channelId?: string;
  focusWindow: boolean;
  platform?: SdkworkDistributionPlatform;
  route: string;
  section?: SdkworkDistributionRouteSection;
  source: "distribution-workspace";
  type: "distribution-route-intent";
}

export interface CreateDistributionRouteIntentOptions {
  basePath?: string;
  channelId?: string;
  focusWindow?: boolean;
  platform?: SdkworkDistributionPlatform;
  section?: SdkworkDistributionRouteSection;
}

export interface SdkworkDistributionArtifact {
  approvalRequired: boolean;
  id: string;
  mirrorStrategy: SdkworkDistributionMirrorStrategy;
  platform: SdkworkDistributionPlatform;
  sizeMb: number;
  status: SdkworkDistributionArtifactStatus;
  title: string;
  updateSource: SdkworkDistributionUpdateSource;
  version: string;
}

export interface SdkworkDistributionChannel {
  approvalRequired: boolean;
  artifactIds: string[];
  description: string;
  id: string;
  riskLevel: SdkworkDistributionRiskLevel;
  rolloutPercent: number;
  targetScope: {
    regions: string[];
    tenantRings: string[];
  };
  title: string;
  type: SdkworkDistributionChannelType;
}

export interface SdkworkDistributionChannelDigest {
  approvalPending: number;
  blockedArtifacts: number;
  readyArtifacts: number;
}

export interface SdkworkDistributionCoverageSummary {
  coveredPlatforms: number;
  missingPlatforms: SdkworkDistributionPlatform[];
  totalPlatforms: number;
}

export interface SdkworkDistributionSummary {
  approvalPending: number;
  blockedArtifacts: number;
  channelCount: number;
  highestRiskLevel: SdkworkDistributionRiskLevel;
  readyArtifacts: number;
  rolloutAveragePercent: number;
  totalArtifacts: number;
}

export interface SdkworkDistributionCatalogData {
  artifacts: SdkworkDistributionArtifact[];
  channelDigests: Record<string, SdkworkDistributionChannelDigest>;
  channels: SdkworkDistributionChannel[];
  coverage: SdkworkDistributionCoverageSummary;
  isAuthenticated: boolean;
  routeIntents: {
    artifacts: SdkworkDistributionRouteIntent;
    channels: SdkworkDistributionRouteIntent;
    overview: SdkworkDistributionRouteIntent;
  };
  selectedChannelId: string | null;
  summary: SdkworkDistributionSummary;
}

export interface CreateEmptySdkworkDistributionCatalogOptions {
  artifacts?: readonly SdkworkDistributionArtifact[];
  basePath?: string;
  channels?: readonly SdkworkDistributionChannel[];
  isAuthenticated?: boolean;
  selectedChannelId?: string | null;
}

const ALL_PLATFORMS: SdkworkDistributionPlatform[] = [
  "windows-x64",
  "windows-arm64",
  "macos-universal",
  "linux-x64",
];

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/distribution").trim();
  if (!normalized || normalized === "/") {
    return "/distribution";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function clampRollout(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function createSdkworkDistributionCapabilityManifest(
  options: SdkworkDistributionCapabilityManifest,
): SdkworkDistributionCapabilityManifest {
  return {
    description: options.description,
    ...(options.host ? { host: options.host } : {}),
    id: options.id,
    packageNames: [...options.packageNames],
    ...(options.theme ? { theme: options.theme } : {}),
    title: options.title,
  };
}

export function createDefaultSdkworkDistributionArtifacts(): SdkworkDistributionArtifact[] {
  return [
    {
      approvalRequired: false,
      id: "artifact-win-x64",
      mirrorStrategy: "global",
      platform: "windows-x64",
      sizeMb: 128,
      status: "ready",
      title: "Desktop Win x64",
      updateSource: "self-hosted",
      version: "1.0.0",
    },
    {
      approvalRequired: false,
      id: "artifact-win-arm64",
      mirrorStrategy: "global",
      platform: "windows-arm64",
      sizeMb: 126,
      status: "ready",
      title: "Desktop Win ARM64",
      updateSource: "self-hosted",
      version: "1.0.0",
    },
    {
      approvalRequired: false,
      id: "artifact-macos-universal",
      mirrorStrategy: "regional",
      platform: "macos-universal",
      sizeMb: 122,
      status: "ready",
      title: "Desktop macOS Universal",
      updateSource: "self-hosted",
      version: "1.0.0",
    },
    {
      approvalRequired: false,
      id: "artifact-linux-x64",
      mirrorStrategy: "regional",
      platform: "linux-x64",
      sizeMb: 124,
      status: "ready",
      title: "Desktop Linux x64",
      updateSource: "self-hosted",
      version: "1.0.0",
    },
  ];
}

export function createDefaultSdkworkDistributionChannels(): SdkworkDistributionChannel[] {
  return [
    {
      approvalRequired: true,
      artifactIds: [
        "artifact-win-x64",
        "artifact-win-arm64",
        "artifact-macos-universal",
        "artifact-linux-x64",
      ],
      description: "Primary production release channel with staged rollout controls.",
      id: "stable-global",
      riskLevel: "low",
      rolloutPercent: 25,
      targetScope: {
        regions: ["global"],
        tenantRings: ["production"],
      },
      title: "Stable",
      type: "stable",
    },
    {
      approvalRequired: false,
      artifactIds: [
        "artifact-win-x64",
        "artifact-linux-x64",
      ],
      description: "Candidate channel for pre-production validation and recovery checks.",
      id: "candidate-global",
      riskLevel: "medium",
      rolloutPercent: 15,
      targetScope: {
        regions: ["global"],
        tenantRings: ["candidate"],
      },
      title: "Candidate",
      type: "candidate",
    },
    {
      approvalRequired: false,
      artifactIds: [
        "artifact-win-x64",
        "artifact-linux-x64",
      ],
      description: "Preview channel for rapid feedback from pilot rings.",
      id: "preview-regional",
      riskLevel: "medium",
      rolloutPercent: 10,
      targetScope: {
        regions: ["cn", "global"],
        tenantRings: ["preview"],
      },
      title: "Preview",
      type: "preview",
    },
  ];
}

function compareChannelType(
  left: SdkworkDistributionChannelType,
  right: SdkworkDistributionChannelType,
): number {
  const rank: Record<SdkworkDistributionChannelType, number> = {
    candidate: 1,
    internal: 3,
    preview: 2,
    stable: 0,
  };

  return rank[left] - rank[right];
}

export function sortSdkworkDistributionChannels(
  channels: readonly SdkworkDistributionChannel[],
): SdkworkDistributionChannel[] {
  return [...channels].sort(
    (left, right) =>
      compareChannelType(left.type, right.type)
      || left.title.localeCompare(right.title),
  );
}

function toRiskRank(value: SdkworkDistributionRiskLevel): number {
  if (value === "high") {
    return 3;
  }

  if (value === "medium") {
    return 2;
  }

  return 1;
}

export function createSdkworkDistributionChannelDigests(
  channels: readonly SdkworkDistributionChannel[],
  artifacts: readonly SdkworkDistributionArtifact[],
): Record<string, SdkworkDistributionChannelDigest> {
  const artifactById = new Map(artifacts.map((artifact) => [artifact.id, artifact]));

  return channels.reduce<Record<string, SdkworkDistributionChannelDigest>>(
    (digests, channel) => {
      const relatedArtifacts = channel.artifactIds
        .map((artifactId) => artifactById.get(artifactId))
        .filter((artifact): artifact is SdkworkDistributionArtifact => Boolean(artifact));
      const digest = relatedArtifacts.reduce<SdkworkDistributionChannelDigest>(
        (state, artifact) => {
          if (artifact.status === "ready") {
            state.readyArtifacts += 1;
          }

          if (artifact.status === "blocked" || artifact.status === "missing") {
            state.blockedArtifacts += 1;
          }

          if (artifact.approvalRequired) {
            state.approvalPending += 1;
          }

          return state;
        },
        {
          approvalPending: channel.approvalRequired ? 1 : 0,
          blockedArtifacts: 0,
          readyArtifacts: 0,
        },
      );

      digests[channel.id] = digest;
      return digests;
    },
    {},
  );
}

export function summarizeSdkworkDistributionCoverage(
  artifacts: readonly SdkworkDistributionArtifact[],
): SdkworkDistributionCoverageSummary {
  const coveredPlatforms = new Set(artifacts.map((artifact) => artifact.platform));
  const missingPlatforms = ALL_PLATFORMS.filter((platform) => !coveredPlatforms.has(platform));

  return {
    coveredPlatforms: coveredPlatforms.size,
    missingPlatforms,
    totalPlatforms: ALL_PLATFORMS.length,
  };
}

export function summarizeSdkworkDistributionCatalog(
  channels: readonly SdkworkDistributionChannel[],
  artifacts: readonly SdkworkDistributionArtifact[],
): SdkworkDistributionSummary {
  const base = channels.reduce(
    (state, channel) => {
      state.rolloutAveragePercent += clampRollout(channel.rolloutPercent);
      if (toRiskRank(channel.riskLevel) > toRiskRank(state.highestRiskLevel)) {
        state.highestRiskLevel = channel.riskLevel;
      }
      if (channel.approvalRequired) {
        state.approvalPending += 1;
      }
      return state;
    },
    {
      approvalPending: 0,
      highestRiskLevel: "low" as SdkworkDistributionRiskLevel,
      rolloutAveragePercent: 0,
    },
  );
  const artifactSummary = artifacts.reduce(
    (state, artifact) => {
      if (artifact.status === "ready") {
        state.readyArtifacts += 1;
      }

      if (artifact.status === "blocked" || artifact.status === "missing") {
        state.blockedArtifacts += 1;
      }

      if (artifact.approvalRequired) {
        state.approvalPending += 1;
      }

      return state;
    },
    {
      approvalPending: 0,
      blockedArtifacts: 0,
      readyArtifacts: 0,
    },
  );

  return {
    approvalPending: base.approvalPending + artifactSummary.approvalPending,
    blockedArtifacts: artifactSummary.blockedArtifacts,
    channelCount: channels.length,
    highestRiskLevel: base.highestRiskLevel,
    readyArtifacts: artifactSummary.readyArtifacts,
    rolloutAveragePercent: channels.length > 0
      ? clampRollout(base.rolloutAveragePercent / channels.length)
      : 0,
    totalArtifacts: artifacts.length,
  };
}

export function createDistributionWorkspaceManifest({
  description = "Distribution center for release channel orchestration, artifact readiness, rollout scope, and approval visibility.",
  host,
  id = "sdkwork-distribution",
  packageNames = [
    "@sdkwork/distribution-pc-react",
    "@sdkwork/install-pc-react",
  ],
  routePath = "/distribution",
  theme,
  title = "Distribution Center",
}: CreateDistributionWorkspaceManifestOptions = {}): SdkworkDistributionWorkspaceManifest {
  return {
    ...createSdkworkDistributionCapabilityManifest({
      description,
      host,
      id,
      packageNames,
      theme,
      title,
    }),
    capability: "distribution",
    routePath: normalizeBasePath(routePath),
  };
}

export function createDistributionRouteIntent(
  options: CreateDistributionRouteIntentOptions = {},
): SdkworkDistributionRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const queryParams = new URLSearchParams();

  if (options.section) {
    queryParams.set("section", options.section);
  }

  if (options.channelId) {
    queryParams.set("channelId", options.channelId);
  }

  if (options.platform) {
    queryParams.set("platform", options.platform);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.channelId ? { channelId: options.channelId } : {}),
    focusWindow: options.focusWindow !== false,
    ...(options.platform ? { platform: options.platform } : {}),
    route: `${basePath}${querySuffix}`,
    ...(options.section ? { section: options.section } : {}),
    source: "distribution-workspace",
    type: "distribution-route-intent",
  };
}

function resolveSelectedChannelId(
  channels: readonly SdkworkDistributionChannel[],
  selectedChannelId: string | null | undefined,
): string | null {
  if (selectedChannelId && channels.some((channel) => channel.id === selectedChannelId)) {
    return selectedChannelId;
  }

  return channels[0]?.id ?? null;
}

export function createEmptySdkworkDistributionCatalog(
  options: CreateEmptySdkworkDistributionCatalogOptions = {},
): SdkworkDistributionCatalogData {
  const artifacts = [...(options.artifacts ?? createDefaultSdkworkDistributionArtifacts())];
  const channels = sortSdkworkDistributionChannels(
    options.channels ?? createDefaultSdkworkDistributionChannels(),
  );
  const selectedChannelId = resolveSelectedChannelId(channels, options.selectedChannelId);
  const basePath = options.basePath ?? "/distribution";

  return {
    artifacts,
    channelDigests: createSdkworkDistributionChannelDigests(channels, artifacts),
    channels,
    coverage: summarizeSdkworkDistributionCoverage(artifacts),
    isAuthenticated: Boolean(options.isAuthenticated),
    routeIntents: {
      artifacts: createDistributionRouteIntent({
        basePath,
        section: "artifacts",
      }),
      channels: createDistributionRouteIntent({
        basePath,
        section: "channels",
      }),
      overview: createDistributionRouteIntent({
        basePath,
      }),
    },
    selectedChannelId,
    summary: summarizeSdkworkDistributionCatalog(channels, artifacts),
  };
}

export const distributionPackageMeta = {
  architecture: "pc-react",
  domain: "device",
  package: "@sdkwork/distribution-pc-react",
  status: "ready",
} as const;

export type DistributionPackageMeta = typeof distributionPackageMeta;

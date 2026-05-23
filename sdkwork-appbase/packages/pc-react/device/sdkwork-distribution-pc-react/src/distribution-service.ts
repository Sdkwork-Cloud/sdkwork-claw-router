import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkDistributionCatalog,
  createDistributionRouteIntent,
  createSdkworkDistributionChannelDigests,
  sortSdkworkDistributionChannels,
  summarizeSdkworkDistributionCatalog,
  summarizeSdkworkDistributionCoverage,
  type SdkworkDistributionArtifact,
  type SdkworkDistributionCatalogData,
  type SdkworkDistributionChannel,
  type SdkworkDistributionChannelType,
} from "./distribution";

export interface GetSdkworkDistributionCatalogInput {
  basePath?: string;
  channelId?: string | null;
  channelType?: SdkworkDistributionChannelType;
}

export interface CreateSdkworkDistributionServiceOptions {
  artifacts?: readonly SdkworkDistributionArtifact[];
  channels?: readonly SdkworkDistributionChannel[];
  getSessionTokens?: () => {
    authToken?: string;
  };
}

export interface SdkworkDistributionService {
  getCatalog(input?: GetSdkworkDistributionCatalogInput): Promise<SdkworkDistributionCatalogData>;
  getEmptyCatalog(input?: GetSdkworkDistributionCatalogInput): SdkworkDistributionCatalogData;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
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

function resolveChannels(
  channels: readonly SdkworkDistributionChannel[],
  channelType: SdkworkDistributionChannelType | undefined,
): SdkworkDistributionChannel[] {
  const filtered = channelType
    ? channels.filter((channel) => channel.type === channelType)
    : [...channels];

  return sortSdkworkDistributionChannels(filtered);
}

function resolveArtifacts(
  channels: readonly SdkworkDistributionChannel[],
  artifacts: readonly SdkworkDistributionArtifact[],
): SdkworkDistributionArtifact[] {
  const selectedArtifactIds = new Set(channels.flatMap((channel) => channel.artifactIds));
  return artifacts.filter((artifact) => selectedArtifactIds.has(artifact.id));
}

function createCatalog(
  input: {
    artifacts: readonly SdkworkDistributionArtifact[];
    basePath?: string;
    channels: readonly SdkworkDistributionChannel[];
    channelType?: SdkworkDistributionChannelType;
    isAuthenticated: boolean;
    selectedChannelId?: string | null;
  },
): SdkworkDistributionCatalogData {
  const channels = resolveChannels(input.channels, input.channelType);
  const artifacts = resolveArtifacts(channels, input.artifacts);
  const selectedChannelId = resolveSelectedChannelId(channels, input.selectedChannelId);
  const basePath = input.basePath ?? "/distribution";

  return {
    artifacts,
    channelDigests: createSdkworkDistributionChannelDigests(channels, artifacts),
    channels,
    coverage: summarizeSdkworkDistributionCoverage(artifacts),
    isAuthenticated: input.isAuthenticated,
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

export function createSdkworkDistributionService(
  options: CreateSdkworkDistributionServiceOptions = {},
): SdkworkDistributionService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());

  return {
    getEmptyCatalog(input = {}) {
      const hasSession = Boolean(normalizeText(getSessionTokens().authToken));
      const fallbackCatalog = createEmptySdkworkDistributionCatalog({
        basePath: input.basePath,
        isAuthenticated: hasSession,
        selectedChannelId: input.channelId ?? null,
      });
      const artifacts = options.artifacts ?? fallbackCatalog.artifacts;
      const channels = options.channels ?? fallbackCatalog.channels;

      return createCatalog({
        artifacts,
        basePath: input.basePath,
        channels,
        channelType: input.channelType,
        isAuthenticated: hasSession,
        selectedChannelId: input.channelId ?? fallbackCatalog.selectedChannelId,
      });
    },

    async getCatalog(input = {}) {
      const hasSession = Boolean(normalizeText(getSessionTokens().authToken));
      const baseCatalog = this.getEmptyCatalog(input);

      return createCatalog({
        artifacts: options.artifacts ?? baseCatalog.artifacts,
        basePath: input.basePath,
        channels: options.channels ?? baseCatalog.channels,
        channelType: input.channelType,
        isAuthenticated: hasSession,
        selectedChannelId: input.channelId ?? baseCatalog.selectedChannelId,
      });
    },
  };
}

export const sdkworkDistributionService = createSdkworkDistributionService();

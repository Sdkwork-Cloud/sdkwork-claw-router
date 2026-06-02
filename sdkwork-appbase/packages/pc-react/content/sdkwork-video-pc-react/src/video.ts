import type { SdkworkMediaResource } from "@sdkwork/appbase-pc-react";

export type SdkworkVideoJobStatus = "queued" | "ready" | "rendering";

export interface SdkworkVideoAsset {
  durationLabel: string;
  id: string;
  presetId: string;
  resource: SdkworkMediaResource;
  resolution: string;
  sceneCount: number;
  status: SdkworkVideoJobStatus;
  title: string;
  updatedAt: string;
}

export interface SdkworkVideoPreset {
  id: string;
  itemCount: number;
  title: string;
}

export interface SdkworkVideoDigest {
  activeRenders: number;
  presetCount: number;
  readyVideos: number;
  totalVideos: number;
}

export interface SdkworkVideoWorkspaceData {
  digest: SdkworkVideoDigest;
  isAuthenticated: boolean;
  presets: SdkworkVideoPreset[];
  videos: SdkworkVideoAsset[];
}

export interface SdkworkVideoRouteIntent {
  focusWindow: boolean;
  presetId?: string;
  route: string;
  source: "video-workspace";
  type: "video-route-intent";
  videoId?: string;
}

export interface CreateVideoRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  presetId?: string;
  videoId?: string;
}

export interface SdkworkVideoWorkspaceManifest {
  capability: "video";
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  routePath: string;
  theme?: string;
  title: string;
}

export interface CreateVideoWorkspaceManifestOptions extends Partial<Omit<SdkworkVideoWorkspaceManifest, "capability" | "routePath">> {
  routePath?: string;
}

export interface CreateEmptySdkworkVideoWorkspaceOptions {
  isAuthenticated?: boolean;
  presets?: readonly SdkworkVideoPreset[];
  videos?: readonly SdkworkVideoAsset[];
}

export const videoPackageMeta = {
  architecture: "pc-react",
  domain: "content",
  package: "@sdkwork/video-pc-react",
  status: "ready",
} as const;

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/video").trim();
  if (!normalized || normalized === "/") {
    return "/video";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function sortSdkworkVideos(videos: readonly SdkworkVideoAsset[]): SdkworkVideoAsset[] {
  return [...videos].sort(
    (left, right) => toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt) || left.title.localeCompare(right.title),
  );
}

function parseDurationSeconds(durationLabel: string): number | undefined {
  const [minutes, seconds] = durationLabel.split(":").map((part) => Number.parseInt(part, 10));
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return undefined;
  }
  return minutes * 60 + seconds;
}

function createGeneratedVideoResource(
  id: string,
  title: string,
  resolution: string,
  durationLabel: string,
  sceneCount: number,
): SdkworkMediaResource {
  const [width, height] = resolution.split("x").map((part) => Number.parseInt(part, 10));
  return {
    ai: {
      provenance: "generated",
    },
    durationSeconds: parseDurationSeconds(durationLabel),
    id: `media-resource-${id}`,
    kind: "video",
    metadata: {
      sceneCount,
    },
    source: "generated",
    title,
    ...(Number.isFinite(width) ? { width } : {}),
    ...(Number.isFinite(height) ? { height } : {}),
  };
}

export function createDefaultSdkworkVideoPresets(): SdkworkVideoPreset[] {
  return [
    { id: "launch-teaser", itemCount: 2, title: "Launch Teaser" },
    { id: "product-demo", itemCount: 1, title: "Product Demo" },
    { id: "social-loop", itemCount: 1, title: "Social Loop" },
  ];
}

export function createDefaultSdkworkVideos(): SdkworkVideoAsset[] {
  const videos = [
    { durationLabel: "00:45", id: "video-launch-cut", presetId: "launch-teaser", resolution: "1920x1080", sceneCount: 12, status: "ready", title: "Launch Cut", updatedAt: "2026-04-03T04:20:00.000Z" },
    { durationLabel: "01:30", id: "video-product-demo", presetId: "product-demo", resolution: "1920x1080", sceneCount: 18, status: "rendering", title: "Product Demo", updatedAt: "2026-04-02T04:20:00.000Z" },
    { durationLabel: "00:12", id: "video-social-loop", presetId: "social-loop", resolution: "1080x1080", sceneCount: 6, status: "ready", title: "Social Loop", updatedAt: "2026-04-01T04:20:00.000Z" },
    { durationLabel: "00:20", id: "video-launch-bumper", presetId: "launch-teaser", resolution: "1080x1920", sceneCount: 4, status: "queued", title: "Launch Bumper", updatedAt: "2026-03-31T04:20:00.000Z" },
  ] as const;

  return videos.map((video) => ({
    ...video,
    resource: createGeneratedVideoResource(video.id, video.title, video.resolution, video.durationLabel, video.sceneCount),
  }));
}

export function summarizeSdkworkVideoWorkspace(
  videos: readonly SdkworkVideoAsset[],
  presets: readonly SdkworkVideoPreset[],
): SdkworkVideoDigest {
  return {
    activeRenders: videos.filter((video) => video.status !== "ready").length,
    presetCount: presets.length,
    readyVideos: videos.filter((video) => video.status === "ready").length,
    totalVideos: videos.length,
  };
}

export function createVideoWorkspaceManifest({
  description = "Video workspace for render presets, scene jobs, and reusable video result browsing.",
  host,
  id = "sdkwork-video",
  packageNames = [
    "@sdkwork/video-pc-react",
    "@sdkwork/media-pc-react",
  ],
  routePath = "/video",
  theme,
  title = "Video Workspace",
}: CreateVideoWorkspaceManifestOptions = {}): SdkworkVideoWorkspaceManifest {
  return {
    capability: "video",
    description,
    ...(host ? { host } : {}),
    id,
    packageNames: [...packageNames],
    routePath: normalizeBasePath(routePath),
    ...(theme ? { theme } : {}),
    title,
  };
}

export function createVideoRouteIntent(options: CreateVideoRouteIntentOptions = {}): SdkworkVideoRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const params = new URLSearchParams();

  if (options.presetId) {
    params.set("presetId", options.presetId);
  }
  if (options.videoId) {
    params.set("videoId", options.videoId);
  }

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.presetId ? { presetId: options.presetId } : {}),
    route: params.toString() ? `${basePath}?${params.toString()}` : basePath,
    source: "video-workspace",
    type: "video-route-intent",
    ...(options.videoId ? { videoId: options.videoId } : {}),
  };
}

export function createEmptySdkworkVideoWorkspace(
  options: CreateEmptySdkworkVideoWorkspaceOptions = {},
): SdkworkVideoWorkspaceData {
  const presets = options.presets?.length ? [...options.presets] : createDefaultSdkworkVideoPresets();
  const videos = sortSdkworkVideos(options.videos?.length ? options.videos : createDefaultSdkworkVideos());

  return {
    digest: summarizeSdkworkVideoWorkspace(videos, presets),
    isAuthenticated: Boolean(options.isAuthenticated),
    presets,
    videos,
  };
}

import type { SdkworkMediaResource } from "@sdkwork/appbase-pc-react";

export type SdkworkMediaItemKind = "audio" | "image" | "video";
export type SdkworkMediaPublishPosture = "blocked" | "draft" | "ready";

export interface SdkworkMediaItem {
  durationLabel: string;
  id: string;
  kind: SdkworkMediaItemKind;
  publishPosture: SdkworkMediaPublishPosture;
  queueId: string;
  resource: SdkworkMediaResource;
  title: string;
  updatedAt: string;
}

export interface SdkworkMediaQueue {
  id: string;
  itemCount: number;
  title: string;
}

export interface SdkworkMediaDigest {
  publishReady: number;
  queueCount: number;
  reviewAttention: number;
  totalItems: number;
}

export interface SdkworkMediaWorkspaceData {
  digest: SdkworkMediaDigest;
  isAuthenticated: boolean;
  items: SdkworkMediaItem[];
  queues: SdkworkMediaQueue[];
}

export interface SdkworkMediaCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: string;
  title: string;
}

export interface SdkworkMediaWorkspaceManifest extends SdkworkMediaCapabilityManifest {
  capability: "media";
  routePath: string;
}

export interface CreateMediaWorkspaceManifestOptions
  extends Partial<
    Pick<SdkworkMediaCapabilityManifest, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkMediaRouteIntent {
  focusWindow: boolean;
  itemId?: string;
  queueId?: string;
  route: string;
  source: "media-workspace";
  type: "media-route-intent";
}

export interface CreateMediaRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  itemId?: string;
  queueId?: string;
}

export interface CreateEmptySdkworkMediaWorkspaceOptions {
  isAuthenticated?: boolean;
  items?: readonly SdkworkMediaItem[];
  queues?: readonly SdkworkMediaQueue[];
}

export const mediaPackageMeta = {
  architecture: "pc-react",
  domain: "content",
  package: "@sdkwork/media-pc-react",
  status: "ready",
} as const;

export type MediaPackageMeta = typeof mediaPackageMeta;

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/media").trim();
  if (!normalized || normalized === "/") {
    return "/media";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function sortSdkworkMediaItems(items: readonly SdkworkMediaItem[]): SdkworkMediaItem[] {
  return [...items].sort(
    (left, right) => toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt) || left.title.localeCompare(right.title),
  );
}

function parseDurationSeconds(durationLabel: string): number | undefined {
  if (durationLabel === "N/A") {
    return undefined;
  }
  const [minutes, seconds] = durationLabel.split(":").map((part) => Number.parseInt(part, 10));
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return undefined;
  }
  return minutes * 60 + seconds;
}

function createGeneratedMediaResource(
  id: string,
  title: string,
  kind: SdkworkMediaItemKind,
  durationLabel: string,
): SdkworkMediaResource {
  return {
    ai: {
      provenance: "generated",
    },
    ...(kind !== "image" ? { durationSeconds: parseDurationSeconds(durationLabel) } : {}),
    id: `media-resource-${id}`,
    kind,
    source: "generated",
    title,
  };
}

export function createDefaultSdkworkMediaQueues(): SdkworkMediaQueue[] {
  return [
    { id: "launch-review", itemCount: 2, title: "Launch Review" },
    { id: "podcast-review", itemCount: 1, title: "Podcast Review" },
    { id: "social-cutdowns", itemCount: 1, title: "Social Cutdowns" },
  ];
}

export function createDefaultSdkworkMediaItems(): SdkworkMediaItem[] {
  const items = [
    { durationLabel: "00:45", id: "media-launch-teaser", kind: "video", publishPosture: "ready", queueId: "launch-review", title: "Launch Teaser", updatedAt: "2026-04-03T04:30:00.000Z" },
    { durationLabel: "03:15", id: "media-podcast-cut", kind: "audio", publishPosture: "blocked", queueId: "podcast-review", title: "Podcast Cut", updatedAt: "2026-04-02T04:30:00.000Z" },
    { durationLabel: "00:12", id: "media-social-loop", kind: "video", publishPosture: "draft", queueId: "social-cutdowns", title: "Social Loop", updatedAt: "2026-04-01T05:30:00.000Z" },
    { durationLabel: "N/A", id: "media-key-visual", kind: "image", publishPosture: "ready", queueId: "launch-review", title: "Key Visual", updatedAt: "2026-03-31T06:30:00.000Z" },
  ] as const;

  return items.map((item) => ({
    ...item,
    resource: createGeneratedMediaResource(item.id, item.title, item.kind, item.durationLabel),
  }));
}

export function summarizeSdkworkMediaWorkspace(items: readonly SdkworkMediaItem[], queues: readonly SdkworkMediaQueue[]): SdkworkMediaDigest {
  return {
    publishReady: items.filter((item) => item.publishPosture === "ready").length,
    queueCount: queues.length,
    reviewAttention: items.filter((item) => item.publishPosture !== "ready").length,
    totalItems: items.length,
  };
}

export function createMediaWorkspaceManifest({
  description = "Media workspace for review queues, publish posture, and reusable cross-media search.",
  host,
  id = "sdkwork-media",
  packageNames = [
    "@sdkwork/media-pc-react",
    "@sdkwork/image-pc-react",
    "@sdkwork/audio-pc-react",
    "@sdkwork/video-pc-react",
  ],
  routePath = "/media",
  theme,
  title = "Media Workspace",
}: CreateMediaWorkspaceManifestOptions = {}): SdkworkMediaWorkspaceManifest {
  return {
    capability: "media",
    description,
    ...(host ? { host } : {}),
    id,
    packageNames: [...packageNames],
    routePath: normalizeBasePath(routePath),
    ...(theme ? { theme } : {}),
    title,
  };
}

export function createMediaRouteIntent(options: CreateMediaRouteIntentOptions = {}): SdkworkMediaRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const params = new URLSearchParams();

  if (options.queueId) {
    params.set("queueId", options.queueId);
  }
  if (options.itemId) {
    params.set("itemId", options.itemId);
  }

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.itemId ? { itemId: options.itemId } : {}),
    ...(options.queueId ? { queueId: options.queueId } : {}),
    route: params.toString() ? `${basePath}?${params.toString()}` : basePath,
    source: "media-workspace",
    type: "media-route-intent",
  };
}

export function createEmptySdkworkMediaWorkspace(
  options: CreateEmptySdkworkMediaWorkspaceOptions = {},
): SdkworkMediaWorkspaceData {
  const queues = options.queues?.length ? [...options.queues] : createDefaultSdkworkMediaQueues();
  const items = sortSdkworkMediaItems(options.items?.length ? options.items : createDefaultSdkworkMediaItems());

  return {
    digest: summarizeSdkworkMediaWorkspace(items, queues),
    isAuthenticated: Boolean(options.isAuthenticated),
    items,
    queues,
  };
}

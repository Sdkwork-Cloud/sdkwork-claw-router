import type { SdkworkMediaKind, SdkworkMediaResource } from "@sdkwork/appbase-pc-react";

export type SdkworkAssetReadiness = "needs-license" | "ready" | "review";
export type SdkworkAssetLicenseTone = "approved" | "restricted" | "review";

export interface SdkworkAsset {
  collectionId: string;
  format: string;
  id: string;
  licenseTone: SdkworkAssetLicenseTone;
  readiness: SdkworkAssetReadiness;
  resource: SdkworkMediaResource;
  sizeLabel: string;
  tags: string[];
  title: string;
  updatedAt: string;
}

export interface SdkworkAssetCollection {
  assetCount: number;
  id: string;
  licenseTone: SdkworkAssetLicenseTone;
  title: string;
}

export interface SdkworkAssetsDigest {
  attentionRequired: number;
  collectionCount: number;
  readyAssets: number;
  totalAssets: number;
}

export interface SdkworkAssetsWorkspaceData {
  assets: SdkworkAsset[];
  collections: SdkworkAssetCollection[];
  digest: SdkworkAssetsDigest;
  isAuthenticated: boolean;
}

export interface SdkworkAssetsCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: string;
  title: string;
}

export interface SdkworkAssetsWorkspaceManifest extends SdkworkAssetsCapabilityManifest {
  capability: "assets";
  routePath: string;
}

export interface CreateAssetsWorkspaceManifestOptions
  extends Partial<
    Pick<SdkworkAssetsCapabilityManifest, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkAssetsRouteIntent {
  assetId?: string;
  collectionId?: string;
  focusWindow: boolean;
  route: string;
  source: "assets-workspace";
  type: "assets-route-intent";
}

export interface CreateAssetsRouteIntentOptions {
  assetId?: string;
  basePath?: string;
  collectionId?: string;
  focusWindow?: boolean;
}

export interface CreateEmptySdkworkAssetsWorkspaceOptions {
  assets?: readonly SdkworkAsset[];
  collections?: readonly SdkworkAssetCollection[];
  isAuthenticated?: boolean;
}

export const assetsPackageMeta = {
  architecture: "pc-react",
  domain: "content",
  package: "@sdkwork/assets-pc-react",
  status: "ready",
} as const;

export type AssetsPackageMeta = typeof assetsPackageMeta;

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/assets").trim();
  if (!normalized || normalized === "/") {
    return "/assets";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function sortSdkworkAssets(assets: readonly SdkworkAsset[]): SdkworkAsset[] {
  return [...assets].sort(
    (left, right) => toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt) || left.title.localeCompare(right.title),
  );
}

function mapAssetFormatToMediaKind(format: string): SdkworkMediaKind {
  if (["png", "svg", "webp", "jpg", "jpeg", "gif"].includes(format)) {
    return "image";
  }
  if (["mp4", "mov", "webm"].includes(format)) {
    return "video";
  }
  if (["mp3", "wav", "aac", "flac"].includes(format)) {
    return "audio";
  }
  return "document";
}

function parseSizeBytes(sizeLabel: string): string | undefined {
  const match = /^(\d+(?:\.\d+)?)\s*(KB|MB|GB)$/i.exec(sizeLabel.trim());
  if (!match) {
    return undefined;
  }
  const value = Number.parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  const multiplier = unit === "GB" ? 1024 * 1024 * 1024 : unit === "MB" ? 1024 * 1024 : 1024;
  return Math.round(value * multiplier).toString();
}

function createObjectStorageAssetResource(
  id: string,
  title: string,
  format: string,
  sizeLabel: string,
  collectionId: string,
): SdkworkMediaResource {
  return {
    fileName: `${id}.${format}`,
    id: `media-resource-${id}`,
    kind: mapAssetFormatToMediaKind(format),
    metadata: {
      collectionId,
    },
    ...(format === "svg" ? { mimeType: "image/svg+xml" } : {}),
    objectKey: `assets/${collectionId}/${id}.${format}`,
    sizeBytes: parseSizeBytes(sizeLabel),
    source: "object_storage",
    title,
  };
}

export function createDefaultSdkworkAssetCollections(): SdkworkAssetCollection[] {
  return [
    { assetCount: 2, id: "brand-system", licenseTone: "approved", title: "Brand System" },
    { assetCount: 1, id: "campaign-kit", licenseTone: "restricted", title: "Campaign Kit" },
    { assetCount: 1, id: "product-renders", licenseTone: "review", title: "Product Renders" },
  ];
}

export function createDefaultSdkworkAssets(): SdkworkAsset[] {
  const assets = [
    {
      collectionId: "brand-system",
      format: "svg",
      id: "asset-logo-lockup",
      licenseTone: "approved",
      readiness: "ready",
      sizeLabel: "512 KB",
      tags: ["brand", "logo"] as string[],
      title: "Logo Lockup",
      updatedAt: "2026-04-03T05:00:00.000Z",
    },
    {
      collectionId: "brand-system",
      format: "png",
      id: "asset-brand-banner",
      licenseTone: "approved",
      readiness: "ready",
      sizeLabel: "2.4 MB",
      tags: ["brand", "banner"] as string[],
      title: "Brand Banner",
      updatedAt: "2026-04-02T07:00:00.000Z",
    },
    {
      collectionId: "campaign-kit",
      format: "png",
      id: "asset-launch-poster",
      licenseTone: "restricted",
      readiness: "needs-license",
      sizeLabel: "4.0 MB",
      tags: ["campaign"] as string[],
      title: "Launch Poster",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
    {
      collectionId: "product-renders",
      format: "webp",
      id: "asset-device-render",
      licenseTone: "review",
      readiness: "review",
      sizeLabel: "6.1 MB",
      tags: ["product", "render"] as string[],
      title: "Device Render",
      updatedAt: "2026-03-30T08:30:00.000Z",
    },
  ] as const;

  return assets.map((asset) => ({
    ...asset,
    resource: createObjectStorageAssetResource(asset.id, asset.title, asset.format, asset.sizeLabel, asset.collectionId),
  }));
}

export function summarizeSdkworkAssetsWorkspace(
  assets: readonly SdkworkAsset[],
  collections: readonly SdkworkAssetCollection[],
): SdkworkAssetsDigest {
  return {
    attentionRequired: assets.filter((asset) => asset.readiness !== "ready").length,
    collectionCount: collections.length,
    readyAssets: assets.filter((asset) => asset.readiness === "ready").length,
    totalAssets: assets.length,
  };
}

export function createAssetsWorkspaceManifest({
  description = "Assets workspace for reusable catalog browsing, collection grouping, and license-readiness posture.",
  host,
  id = "sdkwork-assets",
  packageNames = [
    "@sdkwork/assets-pc-react",
    "@sdkwork/media-pc-react",
    "@sdkwork/drive-pc-react",
  ],
  routePath = "/assets",
  theme,
  title = "Assets Workspace",
}: CreateAssetsWorkspaceManifestOptions = {}): SdkworkAssetsWorkspaceManifest {
  return {
    capability: "assets",
    description,
    ...(host ? { host } : {}),
    id,
    packageNames: [...packageNames],
    routePath: normalizeBasePath(routePath),
    ...(theme ? { theme } : {}),
    title,
  };
}

export function createAssetsRouteIntent(
  options: CreateAssetsRouteIntentOptions = {},
): SdkworkAssetsRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const params = new URLSearchParams();

  if (options.collectionId) {
    params.set("collectionId", options.collectionId);
  }
  if (options.assetId) {
    params.set("assetId", options.assetId);
  }

  return {
    ...(options.assetId ? { assetId: options.assetId } : {}),
    ...(options.collectionId ? { collectionId: options.collectionId } : {}),
    focusWindow: options.focusWindow !== false,
    route: params.toString() ? `${basePath}?${params.toString()}` : basePath,
    source: "assets-workspace",
    type: "assets-route-intent",
  };
}

export function createEmptySdkworkAssetsWorkspace(
  options: CreateEmptySdkworkAssetsWorkspaceOptions = {},
): SdkworkAssetsWorkspaceData {
  const collections = options.collections?.length ? [...options.collections] : createDefaultSdkworkAssetCollections();
  const assets = sortSdkworkAssets(options.assets?.length ? options.assets : createDefaultSdkworkAssets());

  return {
    assets,
    collections,
    digest: summarizeSdkworkAssetsWorkspace(assets, collections),
    isAuthenticated: Boolean(options.isAuthenticated),
  };
}

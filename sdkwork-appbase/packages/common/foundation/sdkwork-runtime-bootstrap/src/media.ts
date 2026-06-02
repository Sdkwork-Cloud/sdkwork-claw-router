export type SdkworkMediaKind =
  | "archive"
  | "audio"
  | "document"
  | "image"
  | "model"
  | "other"
  | "video"
  | "voice";

export type SdkworkMediaSource =
  | "data_url"
  | "external_url"
  | "generated"
  | "object_storage"
  | "provider_asset";

export interface SdkworkMediaChecksum {
  algorithm: "etag" | "md5" | "sha256";
  value: string;
}

export interface SdkworkMediaAccess {
  expiresAt?: string;
  visibility: "organization" | "private" | "public" | "signed" | "tenant";
}

export interface SdkworkMediaAiProvenance {
  generationTaskId?: string;
  model?: string;
  moderationStatus?: "approved" | "blocked" | "pending" | "rejected" | "unknown";
  promptId?: string;
  provider?: string;
  provenance?: "edited" | "generated" | "imported" | "uploaded";
  safetyLabels?: string[];
  seed?: string;
  sourceMediaIds?: string[];
}

export interface SdkworkMediaResource {
  access?: SdkworkMediaAccess;
  ai?: SdkworkMediaAiProvenance;
  altText?: string;
  bucketId?: string;
  checksum?: SdkworkMediaChecksum;
  durationSeconds?: number;
  fileName?: string;
  height?: number;
  id?: string;
  kind: SdkworkMediaKind;
  metadata?: Record<string, unknown>;
  mimeType?: string;
  objectBlobId?: string;
  objectKey?: string;
  objectVersion?: string;
  poster?: SdkworkMediaResource;
  publicUrl?: string;
  sizeBytes?: string;
  source: SdkworkMediaSource;
  thumbnails?: SdkworkMediaResource[];
  title?: string;
  uri?: string;
  url?: string;
  variants?: SdkworkMediaResource[];
  width?: number;
}

export function getSdkworkMediaDeliveryUrl(
  resource: Pick<SdkworkMediaResource, "publicUrl" | "url"> | null | undefined,
): string | undefined {
  return normalizeOptionalText(resource?.publicUrl) || normalizeOptionalText(resource?.url);
}

export function readSdkworkMediaResource(value: unknown): SdkworkMediaResource | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const kind = normalizeSdkworkMediaKind(record.kind);
  const source = normalizeSdkworkMediaSource(record.source);
  if (!kind || !source) {
    return undefined;
  }

  return {
    ...record,
    kind,
    source,
  } as SdkworkMediaResource;
}

export function toExternalSdkworkMediaResource(
  value: string | null | undefined,
  kind: SdkworkMediaKind,
): SdkworkMediaResource | undefined {
  const url = normalizeOptionalText(value);
  return url
    ? {
        kind,
        publicUrl: url,
        source: url.startsWith("data:") ? "data_url" : "external_url",
        url,
      }
    : undefined;
}

function normalizeSdkworkMediaKind(value: unknown): SdkworkMediaKind | undefined {
  const normalized = normalizeOptionalText(value);
  if (
    normalized === "archive"
    || normalized === "audio"
    || normalized === "document"
    || normalized === "image"
    || normalized === "model"
    || normalized === "other"
    || normalized === "video"
    || normalized === "voice"
  ) {
    return normalized;
  }

  return undefined;
}

function normalizeSdkworkMediaSource(value: unknown): SdkworkMediaSource | undefined {
  const normalized = normalizeOptionalText(value);
  if (
    normalized === "data_url"
    || normalized === "external_url"
    || normalized === "generated"
    || normalized === "object_storage"
    || normalized === "provider_asset"
  ) {
    return normalized;
  }

  return undefined;
}

function normalizeOptionalText(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || undefined;
}

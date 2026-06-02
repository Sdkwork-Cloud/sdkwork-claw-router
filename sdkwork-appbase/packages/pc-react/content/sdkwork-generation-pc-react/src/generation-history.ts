import { getSdkworkMediaDeliveryUrl, type SdkworkMediaResource } from "@sdkwork/appbase-pc-react";
import {
  createSdkworkGenerationAssetConfigFromSerialized,
  serializeSdkworkGenerationAssetConfig,
  type SdkworkGenerationAssetModality,
  type SdkworkGenerationSerializedAssetConfig,
} from "./generation-asset-config.ts";

export type SdkworkGenerationHistoryType =
  | "text"
  | "image"
  | "images"
  | "video"
  | "music"
  | "audio"
  | "sfx";

export type SdkworkGenerationPreviewKind = "audio" | "image" | "text" | "video";

export type SdkworkGenerationMediaResource = SdkworkMediaResource;
export type SdkworkGenerationMedia = SdkworkMediaResource;

export interface SdkworkGenerationArtifact {
  asset: SdkworkGenerationMediaResource;
  modality: SdkworkGenerationAssetModality;
}

export interface SdkworkGenerationHistoryItem {
  activeIndex?: number;
  aspectRatio?: SdkworkGenerationSerializedAssetConfig["aspectRatio"];
  createdAt?: string;
  date: string;
  durationSeconds?: number;
  generationConfig?: SdkworkGenerationSerializedAssetConfig;
  id: string;
  asset?: SdkworkGenerationMediaResource;
  images?: SdkworkGenerationMediaResource[];
  modelCatalogKey?: string;
  modelInfo?: string;
  outputText?: string;
  prompt: string;
  status?: string;
  type: SdkworkGenerationHistoryType;
  updatedAt?: string;
  videos?: SdkworkGenerationMediaResource[];
}

export interface CreateSdkworkGenerationPendingHistoryItemInput {
  createdAt?: string;
  generationConfig?: SdkworkGenerationSerializedAssetConfig;
  id: string;
  prompt: string;
  selectedModel?: string;
  status?: string;
  targetType?: SdkworkGenerationAssetModality;
}

export interface MapSdkworkGenerationArtifactsToHistoryMediaResult {
  asset?: SdkworkGenerationMediaResource;
  durationSeconds?: number;
  images: SdkworkGenerationMediaResource[];
  videos: SdkworkGenerationMediaResource[];
}

export interface AppendSdkworkGenerationArtifactOptions {
  updatedAt?: string;
}

export function normalizeSdkworkGenerationHistoryType(
  value: unknown,
): SdkworkGenerationHistoryType {
  switch (value) {
    case "text":
      return "text";
    case "image":
    case "images":
      return "images";
    case "video":
    case "music":
    case "audio":
    case "sfx":
      return value;
    default:
      throw new Error("Generation history type is required");
  }
}

export function mapSdkworkGenerationModalityToHistoryType(
  modality: SdkworkGenerationAssetModality | undefined,
): SdkworkGenerationHistoryType {
  if (modality === undefined) {
    return "text";
  }
  return modality === "image" ? "images" : modality;
}

export function mapSdkworkGenerationHistoryTypeToModality(
  historyType: SdkworkGenerationHistoryType,
): SdkworkGenerationAssetModality | undefined {
  const normalized = normalizeSdkworkGenerationHistoryType(historyType);
  if (normalized === "text") {
    return undefined;
  }
  return normalized === "images" ? "image" : normalized;
}

export function isSdkworkGenerationImageHistoryType(
  historyType: SdkworkGenerationHistoryType,
): boolean {
  const normalized = normalizeSdkworkGenerationHistoryType(historyType);
  return normalized === "images";
}

export function getSdkworkGenerationPreviewKind(
  historyType: SdkworkGenerationHistoryType,
): SdkworkGenerationPreviewKind {
  const normalized = normalizeSdkworkGenerationHistoryType(historyType);
  if (normalized === "text") {
    return "text";
  }
  if (normalized === "video") {
    return "video";
  }
  if (normalized === "images") {
    return "image";
  }
  return "audio";
}

export function createSdkworkGenerationPendingHistoryItem({
  createdAt = new Date().toISOString(),
  generationConfig,
  id,
  prompt,
  selectedModel,
  status = "processing",
  targetType,
}: CreateSdkworkGenerationPendingHistoryItemInput): SdkworkGenerationHistoryItem {
  return {
    aspectRatio: generationConfig?.aspectRatio,
    createdAt,
    date: createdAt.slice(0, 10),
    durationSeconds: generationConfig?.durationSeconds,
    generationConfig,
    id,
    images: [],
    modelCatalogKey: selectedModel,
    modelInfo: selectedModel,
    outputText: "",
    prompt,
    status,
    type: mapSdkworkGenerationModalityToHistoryType(targetType),
    updatedAt: createdAt,
    videos: [],
  };
}

export function restoreSdkworkGenerationSerializedConfigFromHistoryItem(
  item: SdkworkGenerationHistoryItem,
): SdkworkGenerationSerializedAssetConfig | undefined {
  const targetType = mapSdkworkGenerationHistoryTypeToModality(item.type);
  if (!targetType) {
    return undefined;
  }

  const fallbackSummary: SdkworkGenerationSerializedAssetConfig = {
    aspectRatio: item.aspectRatio ?? (targetType === "image" ? "1:1" : undefined),
    durationSeconds: item.durationSeconds,
    imageCount: targetType === "image" ? item.images?.length : undefined,
  };

  return serializeSdkworkGenerationAssetConfig(
    createSdkworkGenerationAssetConfigFromSerialized(item.generationConfig ?? fallbackSummary, targetType),
    targetType,
  );
}

export function mapSdkworkGenerationArtifactsToHistoryMedia(
  artifacts: readonly SdkworkGenerationArtifact[],
  targetType?: SdkworkGenerationAssetModality,
): MapSdkworkGenerationArtifactsToHistoryMediaResult {
  if (targetType === undefined) {
    return {
      images: [],
      videos: [],
    };
  }

  const matching = artifacts.filter((artifact) => artifact.modality === targetType);
  const first = matching[0] ?? artifacts[0];
  const media = matching.map(createSdkworkGenerationMediaResourceFromArtifact);
  const images = targetType === "image"
    ? media
    : [];
  const videos = targetType === "video"
    ? media
    : [];
  const asset = targetType === "image"
    ? images[0]
    : targetType === "video"
      ? videos[0]
      : first ? createSdkworkGenerationMediaResourceFromArtifact(first) : undefined;

  return {
    asset,
    durationSeconds: first?.asset.durationSeconds,
    images,
    videos,
  };
}

export function appendSdkworkGenerationArtifactToHistoryItem<TItem extends SdkworkGenerationHistoryItem>(
  item: TItem,
  artifact: SdkworkGenerationArtifact,
  options: AppendSdkworkGenerationArtifactOptions = {},
): TItem {
  const updatedAt = options.updatedAt ?? new Date().toISOString();
  const artifactType = mapSdkworkGenerationModalityToHistoryType(artifact.modality);

  if (artifact.modality === "image") {
    const nextImage = createSdkworkGenerationMediaResourceFromArtifact(artifact);
    const nextImageUrl = readSdkworkGenerationMediaUrl(nextImage);
    if ((item.images ?? []).some((media) => readSdkworkGenerationMediaUrl(media) === nextImageUrl)) {
      return {
        ...item,
        updatedAt,
      } as TItem;
    }
    return {
      ...item,
      asset: item.asset ?? nextImage,
      images: [...(item.images ?? []), nextImage],
      status: "processing",
      type: artifactType,
      updatedAt,
    } as TItem;
  }

  if (artifact.modality === "video") {
    const nextVideo = createSdkworkGenerationMediaResourceFromArtifact(artifact);
    const nextVideoUrl = readSdkworkGenerationMediaUrl(nextVideo);
    if ((item.videos ?? []).some((media) => readSdkworkGenerationMediaUrl(media) === nextVideoUrl)) {
      return {
        ...item,
        updatedAt,
      } as TItem;
    }
    return {
      ...item,
      durationSeconds: artifact.asset.durationSeconds ?? item.durationSeconds,
      asset: item.asset ?? nextVideo,
      status: "processing",
      type: artifactType,
      updatedAt,
      videos: [...(item.videos ?? []), nextVideo],
    } as TItem;
  }

  const nextAsset = createSdkworkGenerationMediaResourceFromArtifact(artifact);
  return {
    ...item,
    asset: nextAsset,
    durationSeconds: artifact.asset.durationSeconds ?? item.durationSeconds,
    status: "processing",
    type: artifactType,
    updatedAt,
  } as TItem;
}

function createSdkworkGenerationMediaResourceFromArtifact(
  artifact: SdkworkGenerationArtifact,
): SdkworkGenerationMediaResource {
  return cloneSdkworkGenerationMediaResource(artifact.asset);
}

function cloneSdkworkGenerationMediaResource(
  resource: SdkworkGenerationMediaResource,
): SdkworkGenerationMediaResource {
  const clone: SdkworkGenerationMediaResource = { ...resource };
  if (resource.poster) {
    clone.poster = cloneSdkworkGenerationMediaResource(resource.poster);
  }
  if (resource.thumbnails) {
    clone.thumbnails = resource.thumbnails.map(cloneSdkworkGenerationMediaResource);
  }
  return clone;
}

export function readSdkworkGenerationMediaUrl(
  media: SdkworkGenerationMedia | undefined,
): string | undefined {
  const mediaKey = getSdkworkMediaDeliveryUrl(media)
    || media?.uri
    || media?.objectKey
    || media?.id;
  return mediaKey;
}

export function readSdkworkGenerationMediaThumb(
  media: SdkworkGenerationMedia | undefined,
): string | undefined {
  return readSdkworkGenerationMediaUrl(media?.poster)
    || readSdkworkGenerationMediaUrl(media?.thumbnails?.[0])
    || readSdkworkGenerationMediaUrl(media);
}

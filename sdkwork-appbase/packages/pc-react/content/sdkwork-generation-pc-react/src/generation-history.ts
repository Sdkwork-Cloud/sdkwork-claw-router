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

export type SdkworkGenerationMedia = string | { thumb?: string; url?: string };

export interface SdkworkGenerationArtifact {
  durationSeconds?: number;
  mimeType?: string;
  modality: SdkworkGenerationAssetModality;
  thumb?: string;
  url: string;
}

export interface SdkworkGenerationHistoryItem {
  activeIndex?: number;
  aspectRatio?: SdkworkGenerationSerializedAssetConfig["aspectRatio"];
  createdAt?: string;
  date: string;
  durationSeconds?: number;
  generationConfig?: SdkworkGenerationSerializedAssetConfig;
  id: string;
  images?: string[];
  modelCatalogKey?: string;
  modelInfo?: string;
  outputText?: string;
  prompt: string;
  status?: string;
  type: SdkworkGenerationHistoryType;
  updatedAt?: string;
  url?: string;
  videos?: SdkworkGenerationMedia[];
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
  durationSeconds?: number;
  images: string[];
  url?: string;
  videos: SdkworkGenerationMedia[];
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
  const images = targetType === "image"
    ? matching.map((artifact) => artifact.url)
    : [];
  const videos = targetType === "video"
    ? matching.map((artifact) => artifact.thumb ? { thumb: artifact.thumb, url: artifact.url } : { url: artifact.url })
    : [];
  const url = targetType === "image"
    ? images[0]
    : targetType === "video"
      ? readSdkworkGenerationMediaUrl(videos[0])
      : first?.url;

  return {
    durationSeconds: first?.durationSeconds,
    images,
    url,
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
    if (item.images?.includes(artifact.url)) {
      return {
        ...item,
        updatedAt,
      } as TItem;
    }
    return {
      ...item,
      images: [...(item.images ?? []), artifact.url],
      status: "processing",
      type: artifactType,
      updatedAt,
      url: item.url || artifact.url,
    } as TItem;
  }

  if (artifact.modality === "video") {
    const nextVideo = artifact.thumb ? { thumb: artifact.thumb, url: artifact.url } : { url: artifact.url };
    if ((item.videos ?? []).some((media) => readSdkworkGenerationMediaUrl(media) === artifact.url)) {
      return {
        ...item,
        updatedAt,
      } as TItem;
    }
    return {
      ...item,
      durationSeconds: artifact.durationSeconds ?? item.durationSeconds,
      status: "processing",
      type: artifactType,
      updatedAt,
      url: item.url || artifact.url,
      videos: [...(item.videos ?? []), nextVideo],
    } as TItem;
  }

  return {
    ...item,
    durationSeconds: artifact.durationSeconds ?? item.durationSeconds,
    status: "processing",
    type: artifactType,
    updatedAt,
    url: artifact.url,
  } as TItem;
}

export function readSdkworkGenerationMediaUrl(
  media: SdkworkGenerationMedia | undefined,
): string | undefined {
  return typeof media === "string" ? media : media?.url;
}

export function readSdkworkGenerationMediaThumb(
  media: SdkworkGenerationMedia | undefined,
): string | undefined {
  return typeof media === "string" ? media : media?.thumb || media?.url;
}

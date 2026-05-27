export type SdkworkGenerationAssetModality = "audio" | "image" | "music" | "sfx" | "video";
export type SdkworkGenerationAssetAspectRatio = "1:1" | "16:9" | "9:16";
export type SdkworkGenerationAssetQuality = "high" | "standard";

export interface SdkworkGenerationImageModeConfig {
  aspectRatio: "auto" | "1:1" | "16:9" | "21:9" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16";
  count: number;
  quality: "1k" | "2k";
}

export interface SdkworkGenerationVideoModeConfig {
  aspectRatio: SdkworkGenerationAssetAspectRatio;
  count: number;
  duration: number;
  resolution: "4k" | "720p" | "1080p";
  syncAudioVideo: boolean;
}

export interface SdkworkGenerationSpeechModeConfig {
  responseFormat?: "aac" | "flac" | "mp3" | "opus" | "pcm" | "wav";
  speed?: number;
  voice?: string;
}

export interface SdkworkGenerationSfxModeConfig {
  loop: boolean;
  promptInfluence: number;
  responseFormat?: "mp3" | "wav";
}

export interface SdkworkGenerationAssetConfig {
  aspectRatio: SdkworkGenerationAssetAspectRatio;
  durationSeconds: number;
  imageCount: number;
  imageMode?: SdkworkGenerationImageModeConfig;
  quality: SdkworkGenerationAssetQuality;
  sfxMode?: SdkworkGenerationSfxModeConfig;
  speechMode?: SdkworkGenerationSpeechModeConfig;
  videoMode?: SdkworkGenerationVideoModeConfig;
}

export interface SdkworkGenerationSerializedAssetConfig {
  aspectRatio?: SdkworkGenerationAssetAspectRatio;
  durationSeconds?: number;
  imageCount?: number;
  imageMode?: SdkworkGenerationImageModeConfig;
  loop?: boolean;
  promptInfluence?: number;
  quality?: SdkworkGenerationAssetQuality;
  responseFormat?: SdkworkGenerationSpeechModeConfig["responseFormat"] | SdkworkGenerationSfxModeConfig["responseFormat"];
  resolution?: SdkworkGenerationVideoModeConfig["resolution"];
  sfxMode?: Partial<SdkworkGenerationSfxModeConfig>;
  speechMode?: Partial<SdkworkGenerationSpeechModeConfig>;
  speed?: number;
  syncAudioVideo?: boolean;
  videoMode?: SdkworkGenerationVideoModeConfig;
  voice?: string;
}

export type SdkworkGenerationModelBucket = "llms" | "images" | "videos" | "audios" | "music" | "sfx";

export interface SdkworkGenerationReferencePrice {
  billingMeter: string;
  currency: string;
  unitPrice: string;
}

export interface SdkworkGenerationPriceAvailability {
  status: "reference" | "unavailable";
  reason?: string | null;
}

export interface SdkworkGenerationPricedModel {
  officialReferenceCurrency?: string | null;
  officialReferencePrices: readonly SdkworkGenerationReferencePrice[];
  officialReferenceUnitPrice?: string | null;
  priceAvailability: SdkworkGenerationPriceAvailability;
}

export type SdkworkGenerationModelBuckets<TModel> = {
  [Bucket in SdkworkGenerationModelBucket]: readonly TModel[];
};

export interface SdkworkGenerationCreditEstimate {
  points: number | null;
  detail: string;
  reference: boolean;
}

export interface EstimateSdkworkGenerationCreditsInput<TModel extends SdkworkGenerationPricedModel> {
  config: SdkworkGenerationAssetConfig;
  modality: SdkworkGenerationAssetModality;
  model: TModel | null | undefined;
  pointsPerUsd?: number;
  unavailableDetail?: string;
}

const DEFAULT_SDKWORK_GENERATION_POINTS_PER_USD = 10;
const DEFAULT_SDKWORK_GENERATION_COST_UNAVAILABLE_DETAIL = "sdkwork.generation.cost.unavailable";

export const DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG: SdkworkGenerationImageModeConfig = {
  aspectRatio: "auto",
  count: 2,
  quality: "1k",
};

export const DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG: SdkworkGenerationVideoModeConfig = {
  aspectRatio: "16:9",
  count: 1,
  duration: 5,
  resolution: "720p",
  syncAudioVideo: true,
};

export const DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG: SdkworkGenerationSpeechModeConfig = {
  responseFormat: "mp3",
  speed: 1,
};

export const DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG: SdkworkGenerationSfxModeConfig = {
  loop: false,
  promptInfluence: 0.3,
  responseFormat: "mp3",
};

export function getDefaultSdkworkGenerationDurationSeconds(
  modality: SdkworkGenerationAssetModality,
): number {
  switch (modality) {
    case "video":
      return 5;
    case "music":
      return 30;
    case "audio":
      return 10;
    case "sfx":
      return 5;
    case "image":
      return 1;
  }
}

export function createDefaultSdkworkGenerationAssetConfig(
  modality: SdkworkGenerationAssetModality,
): SdkworkGenerationAssetConfig {
  if (modality === "image") {
    const imageMode = { ...DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG };
    return {
      aspectRatio: normalizeImageAspectRatio(imageMode.aspectRatio, "1:1"),
      durationSeconds: getDefaultSdkworkGenerationDurationSeconds(modality),
      imageCount: imageMode.count,
      imageMode,
      quality: imageMode.quality === "2k" ? "high" : "standard",
      sfxMode: undefined,
      speechMode: undefined,
      videoMode: undefined,
    };
  }

  if (modality === "video") {
    const videoMode = { ...DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG };
    return {
      aspectRatio: videoMode.aspectRatio,
      durationSeconds: videoMode.duration,
      imageCount: videoMode.count,
      imageMode: undefined,
      quality: "standard",
      sfxMode: undefined,
      speechMode: undefined,
      videoMode,
    };
  }

  const speechMode = modality === "audio"
    ? { ...DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG }
    : undefined;
  const sfxMode = modality === "sfx"
    ? { ...DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG }
    : undefined;
  return {
    aspectRatio: "1:1",
    durationSeconds: getDefaultSdkworkGenerationDurationSeconds(modality),
    imageCount: 1,
    imageMode: undefined,
    quality: "standard",
    sfxMode,
    speechMode,
    videoMode: undefined,
  };
}

export function reconcileSdkworkGenerationAssetConfig(
  config: SdkworkGenerationAssetConfig,
  modality: SdkworkGenerationAssetModality,
): SdkworkGenerationAssetConfig {
  const defaultConfig = createDefaultSdkworkGenerationAssetConfig(modality);
  const hasImageMode = config.imageMode !== undefined;
  const hasVideoMode = config.videoMode !== undefined;
  const hasSpeechMode = config.speechMode !== undefined;
  const hasSfxMode = config.sfxMode !== undefined;
  const isCrossModalityConfig = (modality === "image" && hasVideoMode && !hasImageMode)
    || (modality === "video" && hasImageMode && !hasVideoMode)
    || (modality === "audio" && (hasImageMode || hasVideoMode || hasSfxMode))
    || (modality === "sfx" && (hasImageMode || hasVideoMode || hasSpeechMode))
    || (modality !== "image" && modality !== "video" && modality !== "audio" && modality !== "sfx" && (hasImageMode || hasVideoMode || hasSpeechMode || hasSfxMode))
    || (modality !== "audio" && hasSpeechMode)
    || (modality !== "sfx" && hasSfxMode);
  if (isCrossModalityConfig) {
    return defaultConfig;
  }

  const next = {
    ...defaultConfig,
    ...config,
    durationSeconds: config.durationSeconds || defaultConfig.durationSeconds,
  };

  if (modality === "image") {
    const imageMode = next.imageMode ?? { ...DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG };
    return {
      ...next,
      aspectRatio: normalizeImageAspectRatio(imageMode.aspectRatio, next.aspectRatio),
      imageCount: imageMode.count,
      imageMode,
      quality: imageMode.quality === "2k" ? "high" : "standard",
      sfxMode: undefined,
      speechMode: undefined,
      videoMode: undefined,
    };
  }

  if (modality === "video") {
    const videoMode = next.videoMode ?? { ...DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG };
    return {
      ...next,
      aspectRatio: videoMode.aspectRatio,
      durationSeconds: videoMode.duration,
      imageCount: videoMode.count,
      imageMode: undefined,
      sfxMode: undefined,
      speechMode: undefined,
      videoMode,
    };
  }

  if (modality === "audio") {
    return {
      ...next,
      imageMode: undefined,
      sfxMode: undefined,
      speechMode: normalizeSpeechModeConfig(next.speechMode ?? DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG),
      videoMode: undefined,
    };
  }

  if (modality === "sfx") {
    return {
      ...next,
      imageMode: undefined,
      sfxMode: normalizeSfxModeConfig(next.sfxMode ?? DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG),
      speechMode: undefined,
      videoMode: undefined,
    };
  }

  return {
    ...next,
    imageMode: undefined,
    sfxMode: undefined,
    speechMode: undefined,
    videoMode: undefined,
  };
}

export function serializeSdkworkGenerationAssetConfig(
  config: SdkworkGenerationAssetConfig,
  modality: SdkworkGenerationAssetModality,
): SdkworkGenerationSerializedAssetConfig {
  const reconciled = reconcileSdkworkGenerationAssetConfig(config, modality);
  const result: SdkworkGenerationSerializedAssetConfig = {
    aspectRatio: reconciled.aspectRatio,
    durationSeconds: reconciled.durationSeconds,
    imageCount: reconciled.imageCount,
    imageMode: reconciled.imageMode,
    quality: reconciled.quality,
    videoMode: reconciled.videoMode,
  };

  if (modality === "video" && reconciled.videoMode) {
    result.resolution = reconciled.videoMode.resolution;
    result.syncAudioVideo = reconciled.videoMode.syncAudioVideo;
  }

  if (modality === "audio" && reconciled.speechMode) {
    result.speechMode = reconciled.speechMode;
    if (reconciled.speechMode.voice) {
      result.voice = reconciled.speechMode.voice;
    }
    if (reconciled.speechMode.responseFormat) {
      result.responseFormat = reconciled.speechMode.responseFormat;
    }
    if (reconciled.speechMode.speed !== undefined) {
      result.speed = reconciled.speechMode.speed;
    }
  }

  if (modality === "sfx" && reconciled.sfxMode) {
    result.sfxMode = reconciled.sfxMode;
    result.loop = reconciled.sfxMode.loop;
    result.promptInfluence = reconciled.sfxMode.promptInfluence;
    if (reconciled.sfxMode.responseFormat) {
      result.responseFormat = reconciled.sfxMode.responseFormat;
    }
  }

  return result;
}

export function createSdkworkGenerationAssetConfigFromSerialized(
  serialized: SdkworkGenerationSerializedAssetConfig | undefined,
  modality: SdkworkGenerationAssetModality,
): SdkworkGenerationAssetConfig {
  const defaultConfig = createDefaultSdkworkGenerationAssetConfig(modality);
  if (!serialized) {
    return defaultConfig;
  }

  if (modality === "image") {
    const imageMode = serialized.imageMode
      ? { ...serialized.imageMode }
      : {
        ...DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG,
        aspectRatio: serialized.aspectRatio ?? DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG.aspectRatio,
        count: serialized.imageCount ?? DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG.count,
        quality: serialized.quality === "high" ? "2k" : DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG.quality,
      };
    return reconcileSdkworkGenerationAssetConfig({
      ...defaultConfig,
      aspectRatio: serialized.aspectRatio ?? defaultConfig.aspectRatio,
      durationSeconds: serialized.durationSeconds ?? defaultConfig.durationSeconds,
      imageCount: serialized.imageCount ?? imageMode.count,
      imageMode,
      quality: serialized.quality ?? (imageMode.quality === "2k" ? "high" : "standard"),
      sfxMode: undefined,
      videoMode: undefined,
    }, modality);
  }

  if (modality === "video") {
    const videoMode = serialized.videoMode
      ? { ...serialized.videoMode }
      : {
        ...DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG,
        aspectRatio: serialized.aspectRatio ?? DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG.aspectRatio,
        duration: serialized.durationSeconds ?? DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG.duration,
        resolution: serialized.resolution ?? DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG.resolution,
        syncAudioVideo: serialized.syncAudioVideo ?? DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG.syncAudioVideo,
      };
    return reconcileSdkworkGenerationAssetConfig({
      ...defaultConfig,
      aspectRatio: serialized.aspectRatio ?? videoMode.aspectRatio,
      durationSeconds: serialized.durationSeconds ?? videoMode.duration,
      imageCount: serialized.imageCount ?? videoMode.count,
      imageMode: undefined,
      quality: serialized.quality ?? defaultConfig.quality,
      sfxMode: undefined,
      speechMode: undefined,
      videoMode,
    }, modality);
  }

  if (modality === "audio") {
    const speechMode = normalizeSpeechModeConfig({
      ...DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG,
      ...serialized.speechMode,
      responseFormat: serialized.responseFormat ?? serialized.speechMode?.responseFormat ?? DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG.responseFormat,
      speed: serialized.speed ?? serialized.speechMode?.speed ?? DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG.speed,
      voice: serialized.voice ?? serialized.speechMode?.voice,
    });
    return reconcileSdkworkGenerationAssetConfig({
      ...defaultConfig,
      aspectRatio: serialized.aspectRatio ?? defaultConfig.aspectRatio,
      durationSeconds: serialized.durationSeconds ?? defaultConfig.durationSeconds,
      imageCount: serialized.imageCount ?? defaultConfig.imageCount,
      imageMode: undefined,
      quality: serialized.quality ?? defaultConfig.quality,
      sfxMode: undefined,
      speechMode,
      videoMode: undefined,
    }, modality);
  }

  if (modality === "sfx") {
    const sfxMode = normalizeSfxModeConfig({
      ...DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG,
      ...serialized.sfxMode,
      loop: serialized.loop ?? serialized.sfxMode?.loop ?? DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG.loop,
      promptInfluence: serialized.promptInfluence ?? serialized.sfxMode?.promptInfluence ?? DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG.promptInfluence,
      responseFormat: normalizeSfxResponseFormat(serialized.responseFormat)
        ?? normalizeSfxResponseFormat(serialized.sfxMode?.responseFormat)
        ?? DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG.responseFormat,
    });
    return reconcileSdkworkGenerationAssetConfig({
      ...defaultConfig,
      aspectRatio: serialized.aspectRatio ?? defaultConfig.aspectRatio,
      durationSeconds: serialized.durationSeconds ?? defaultConfig.durationSeconds,
      imageCount: serialized.imageCount ?? defaultConfig.imageCount,
      imageMode: undefined,
      quality: serialized.quality ?? defaultConfig.quality,
      sfxMode,
      speechMode: undefined,
      videoMode: undefined,
    }, modality);
  }

  return reconcileSdkworkGenerationAssetConfig({
    ...defaultConfig,
    aspectRatio: serialized.aspectRatio ?? defaultConfig.aspectRatio,
    durationSeconds: serialized.durationSeconds ?? defaultConfig.durationSeconds,
    imageCount: serialized.imageCount ?? defaultConfig.imageCount,
    imageMode: undefined,
    quality: serialized.quality ?? defaultConfig.quality,
    sfxMode: undefined,
    speechMode: undefined,
    videoMode: undefined,
  }, modality);
}

export function updateSdkworkGenerationImageModeConfig(
  config: SdkworkGenerationAssetConfig,
  imageMode: SdkworkGenerationImageModeConfig,
): SdkworkGenerationAssetConfig {
  return reconcileSdkworkGenerationAssetConfig({
    ...config,
    imageMode,
  }, "image");
}

export function updateSdkworkGenerationVideoModeConfig(
  config: SdkworkGenerationAssetConfig,
  videoMode: SdkworkGenerationVideoModeConfig,
): SdkworkGenerationAssetConfig {
  return reconcileSdkworkGenerationAssetConfig({
    ...config,
    videoMode,
  }, "video");
}

export function updateSdkworkGenerationSpeechModeConfig(
  config: SdkworkGenerationAssetConfig,
  speechMode: SdkworkGenerationSpeechModeConfig,
): SdkworkGenerationAssetConfig {
  return reconcileSdkworkGenerationAssetConfig({
    ...config,
    speechMode: normalizeSpeechModeConfig(speechMode),
  }, "audio");
}

export function updateSdkworkGenerationSfxModeConfig(
  config: SdkworkGenerationAssetConfig,
  sfxMode: SdkworkGenerationSfxModeConfig,
): SdkworkGenerationAssetConfig {
  return reconcileSdkworkGenerationAssetConfig({
    ...config,
    sfxMode: normalizeSfxModeConfig(sfxMode),
  }, "sfx");
}

export function getSdkworkGenerationModelBucket(
  modality: SdkworkGenerationAssetModality,
): Exclude<SdkworkGenerationModelBucket, "llms"> {
  switch (modality) {
    case "image":
      return "images";
    case "video":
      return "videos";
    case "music":
      return "music";
    case "audio":
      return "audios";
    case "sfx":
      return "sfx";
  }
}

export function findSdkworkGenerationModelById<TModel extends { id: string }>(
  groups: readonly SdkworkGenerationModelBuckets<TModel>[],
  modelId: string,
): TModel | null {
  for (const group of groups) {
    for (const bucket of ["llms", "images", "videos", "audios", "music", "sfx"] as const) {
      const model = group[bucket].find((item) => item.id === modelId);
      if (model) {
        return model;
      }
    }
  }
  return null;
}

export function findFirstSdkworkGenerationModelForModality<TModel>(
  groups: readonly SdkworkGenerationModelBuckets<TModel>[],
  modality: SdkworkGenerationAssetModality,
): TModel | null {
  const bucket = getSdkworkGenerationModelBucket(modality);
  for (const group of groups) {
    const model = group[bucket][0];
    if (model) {
      return model;
    }
  }
  return null;
}

export function getSdkworkGenerationDurationOptions(
  modality: SdkworkGenerationAssetModality,
): number[] {
  switch (modality) {
    case "video":
      return [5, 10, 15];
    case "music":
      return [30, 60, 120];
    case "audio":
      return [10, 30, 60];
    case "sfx":
      return [3, 5, 10];
    case "image":
      return [];
  }
}

export function estimateSdkworkGenerationCredits<TModel extends SdkworkGenerationPricedModel>({
  config,
  modality,
  model,
  pointsPerUsd = DEFAULT_SDKWORK_GENERATION_POINTS_PER_USD,
  unavailableDetail = DEFAULT_SDKWORK_GENERATION_COST_UNAVAILABLE_DETAIL,
}: EstimateSdkworkGenerationCreditsInput<TModel>): SdkworkGenerationCreditEstimate {
  if (!model || model.priceAvailability.status === "unavailable") {
    return createUnavailableSdkworkGenerationCreditEstimate(unavailableDetail);
  }

  const price = selectSdkworkGenerationReferencePrice(model.officialReferencePrices, modality)
    ?? createFallbackSdkworkGenerationReferencePrice(model);
  if (!price) {
    return createUnavailableSdkworkGenerationCreditEstimate(unavailableDetail);
  }

  const unitPrice = readPositiveSdkworkGenerationNumber(price.unitPrice);
  if (unitPrice === null) {
    return createUnavailableSdkworkGenerationCreditEstimate(unavailableDetail);
  }

  const quantity = estimateSdkworkGenerationMeterQuantity(price.billingMeter, modality, config);
  const points = Math.ceil(unitPrice * quantity * pointsPerUsd);
  return {
    points,
    detail: describeSdkworkGenerationCreditEstimate(price, quantity),
    reference: model.priceAvailability.status === "reference",
  };
}

function normalizeImageAspectRatio(
  aspectRatio: SdkworkGenerationImageModeConfig["aspectRatio"],
  fallback: SdkworkGenerationAssetAspectRatio,
): SdkworkGenerationAssetAspectRatio {
  if (aspectRatio === "1:1" || aspectRatio === "16:9" || aspectRatio === "9:16") {
    return aspectRatio;
  }
  return fallback;
}

function normalizeSpeechModeConfig(
  speechMode: SdkworkGenerationSpeechModeConfig,
): SdkworkGenerationSpeechModeConfig {
  const voice = speechMode.voice?.trim();
  return {
    responseFormat: normalizeSpeechResponseFormat(speechMode.responseFormat)
      ?? DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG.responseFormat,
    speed: normalizeSpeechSpeed(speechMode.speed)
      ?? DEFAULT_SDKWORK_GENERATION_SPEECH_MODE_CONFIG.speed,
    ...(voice ? { voice } : {}),
  };
}

function normalizeSfxModeConfig(
  sfxMode: Partial<SdkworkGenerationSfxModeConfig>,
): SdkworkGenerationSfxModeConfig {
  return {
    loop: sfxMode.loop === true,
    promptInfluence: normalizeSfxPromptInfluence(sfxMode.promptInfluence)
      ?? DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG.promptInfluence,
    responseFormat: normalizeSfxResponseFormat(sfxMode.responseFormat)
      ?? DEFAULT_SDKWORK_GENERATION_SFX_MODE_CONFIG.responseFormat,
  };
}

function normalizeSpeechResponseFormat(
  responseFormat: SdkworkGenerationSpeechModeConfig["responseFormat"] | string | undefined,
): SdkworkGenerationSpeechModeConfig["responseFormat"] | undefined {
  const normalized = responseFormat?.trim().replace(/^\./u, "").toLowerCase();
  if (
    normalized === "aac"
    || normalized === "flac"
    || normalized === "mp3"
    || normalized === "opus"
    || normalized === "pcm"
    || normalized === "wav"
  ) {
    return normalized;
  }
  return undefined;
}

function normalizeSfxResponseFormat(
  responseFormat: SdkworkGenerationSfxModeConfig["responseFormat"] | string | undefined,
): SdkworkGenerationSfxModeConfig["responseFormat"] | undefined {
  const normalized = responseFormat?.trim().replace(/^\./u, "").toLowerCase();
  if (normalized === "mp3" || normalized === "wav") {
    return normalized;
  }
  return undefined;
}

function normalizeSpeechSpeed(speed: number | undefined): number | undefined {
  if (speed === undefined || !Number.isFinite(speed)) {
    return undefined;
  }
  return Math.min(4, Math.max(0.25, speed));
}

function normalizeSfxPromptInfluence(promptInfluence: number | undefined): number | undefined {
  if (promptInfluence === undefined || !Number.isFinite(promptInfluence)) {
    return undefined;
  }
  return Math.min(1, Math.max(0, promptInfluence));
}

function createUnavailableSdkworkGenerationCreditEstimate(detail: string): SdkworkGenerationCreditEstimate {
  return {
    detail,
    points: null,
    reference: false,
  };
}

function selectSdkworkGenerationReferencePrice(
  prices: readonly SdkworkGenerationReferencePrice[],
  modality: SdkworkGenerationAssetModality,
): SdkworkGenerationReferencePrice | null {
  const meters = getSdkworkGenerationMetersForModality(modality);
  for (const meter of meters) {
    const price = prices.find((candidate) => candidate.billingMeter === meter);
    if (price) {
      return price;
    }
  }
  return prices[0] ?? null;
}

function createFallbackSdkworkGenerationReferencePrice(
  model: SdkworkGenerationPricedModel,
): SdkworkGenerationReferencePrice | null {
  if (!model.officialReferenceUnitPrice || readPositiveSdkworkGenerationNumber(model.officialReferenceUnitPrice) === null) {
    return null;
  }
  return {
    billingMeter: "api_result",
    currency: model.officialReferenceCurrency || "USD",
    unitPrice: model.officialReferenceUnitPrice,
  };
}

function getSdkworkGenerationMetersForModality(
  modality: SdkworkGenerationAssetModality,
): string[] {
  switch (modality) {
    case "image":
      return ["image_result", "image_megapixel", "image_pixel", "image_output_token", "api_result"];
    case "video":
      return ["video_output_second", "video_input_second", "video_result", "api_result"];
    case "music":
      return ["music_output_second", "audio_output_second", "sfx_result", "api_result"];
    case "audio":
      return ["audio_output_second", "audio_output_minute", "tts_input_character", "speech_character", "api_result"];
    case "sfx":
      return ["sfx_result", "audio_output_second", "audio_output_minute", "api_result"];
  }
}

function estimateSdkworkGenerationMeterQuantity(
  billingMeter: string,
  modality: SdkworkGenerationAssetModality,
  config: SdkworkGenerationAssetConfig,
): number {
  const qualityMultiplier = config.quality === "high" ? 1.5 : 1;
  if (billingMeter.endsWith("_minute")) {
    return Math.max(1, Math.ceil(config.durationSeconds / 60));
  }
  if (billingMeter.endsWith("_second")) {
    return Math.max(1, config.durationSeconds);
  }
  if (billingMeter === "image_result") {
    return config.imageCount * qualityMultiplier;
  }
  if (billingMeter === "image_megapixel") {
    return config.imageCount * estimateSdkworkGenerationImagePixels(config.aspectRatio) / 1_000_000 * qualityMultiplier;
  }
  if (billingMeter === "image_pixel") {
    return config.imageCount * estimateSdkworkGenerationImagePixels(config.aspectRatio) * qualityMultiplier;
  }
  if (billingMeter === "video_result") {
    return Math.max(1, Math.ceil(config.durationSeconds / 5));
  }
  if (billingMeter === "sfx_result") {
    return Math.max(1, modality === "sfx" ? 1 : Math.ceil(config.durationSeconds / 30));
  }
  return 1;
}

function estimateSdkworkGenerationImagePixels(
  aspectRatio: SdkworkGenerationAssetAspectRatio,
): number {
  switch (aspectRatio) {
    case "16:9":
    case "9:16":
      return 1792 * 1024;
    case "1:1":
    default:
      return 1024 * 1024;
  }
}

function describeSdkworkGenerationCreditEstimate(
  price: SdkworkGenerationReferencePrice,
  quantity: number,
): string {
  return `${price.currency} ${formatSdkworkGenerationDecimal(price.unitPrice)} x ${formatSdkworkGenerationDecimal(quantity.toString())} ${getSdkworkGenerationUnitLabelForMeter(price.billingMeter)}`;
}

function getSdkworkGenerationUnitLabelForMeter(billingMeter: string): string {
  if (billingMeter.endsWith("_second")) {
    return "sec";
  }
  if (billingMeter.endsWith("_minute")) {
    return "min";
  }
  if (billingMeter === "image_result") {
    return "image";
  }
  if (billingMeter === "video_result") {
    return "video";
  }
  if (billingMeter === "sfx_result") {
    return "effect";
  }
  if (billingMeter === "image_megapixel") {
    return "MP";
  }
  if (billingMeter === "image_pixel") {
    return "px";
  }
  return "unit";
}

function readPositiveSdkworkGenerationNumber(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return null;
  }
  return number;
}

function formatSdkworkGenerationDecimal(value: string): string {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return value;
  }
  return number.toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

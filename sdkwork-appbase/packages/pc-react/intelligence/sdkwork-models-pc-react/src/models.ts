import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkModelProviderTone =
  | "amber"
  | "blue"
  | "cyan"
  | "emerald"
  | "fuchsia"
  | "indigo"
  | "orange"
  | "rose"
  | "sky"
  | "teal"
  | "violet"
  | "zinc";
export type SdkworkModelProviderRegion = "china" | "eu" | "global" | "us";
export type SdkworkModelModality =
  | "audio"
  | "embedding"
  | "image"
  | "music"
  | "text"
  | "video";
export type SdkworkModelCapability =
  | "agentic"
  | "audio-input"
  | "audio-output"
  | "code"
  | "image-generation"
  | "reasoning"
  | "realtime"
  | "structured-output"
  | "tool-calling"
  | "video-generation"
  | "vision";
export type SdkworkModelStatus = "available" | "deprecated" | "preview" | "unavailable";
export type SdkworkModelPricingTier = "enterprise" | "free" | "paid";
export type SdkworkModelPurchaseMode = "included" | "purchase-required" | "upgrade-required";
export type SdkworkSubscriptionTier = "enterprise" | "free" | "pro" | "standard";
export type SdkworkModelSortMode = "context-window" | "featured" | "name" | "price-ascending";

export interface SdkworkModelProviderMeta {
  id: string;
  label: string;
  officialUrl?: string;
  region: SdkworkModelProviderRegion;
  tone: SdkworkModelProviderTone;
}

export interface SdkworkModelPricing {
  inputPerMillionUsd?: number;
  outputPerMillionUsd?: number;
  tier: SdkworkModelPricingTier;
}

export interface SdkworkModelCatalogItem {
  accessTier: SdkworkSubscriptionTier;
  capabilities: readonly SdkworkModelCapability[];
  contextWindowTokens?: number;
  description?: string;
  id: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  modalities: readonly SdkworkModelModality[];
  name: string;
  pricing: SdkworkModelPricing;
  providerId: string;
  purchaseMode: SdkworkModelPurchaseMode;
  status: SdkworkModelStatus;
}

export interface SortModelCatalogOptions {
  mode?: SdkworkModelSortMode;
}

export interface FilterModelCatalogOptions extends SortModelCatalogOptions {
  capabilities?: readonly SdkworkModelCapability[];
  minContextTokens?: number;
  modalities?: readonly SdkworkModelModality[];
  pricingTiers?: readonly SdkworkModelPricingTier[];
  providers?: readonly string[];
  query?: string;
  statuses?: readonly SdkworkModelStatus[];
}

export interface SdkworkModelCatalogSummary {
  featuredModels: number;
  multimodalModels: number;
  previewModels: number;
  providerCount: number;
  totalModels: number;
}

export interface ResolveModelAccessStateOptions {
  allowPreview?: boolean;
  purchasedModelIds?: readonly string[];
  subscriptionTier: SdkworkSubscriptionTier;
}

export interface SdkworkModelAccessState {
  action: "blocked" | "included" | "purchase" | "purchased" | "upgrade";
  canActivate: boolean;
  canPurchase: boolean;
  reason?: "plan-required" | "preview-disabled" | "purchase-required" | "status-unavailable";
}

export type SdkworkModelRecommendationReason = "budget-fit" | "capability-fit" | "context-fit";
export type SdkworkModelRecommendationBudget = "economy" | "balanced" | "premium";

export interface RecommendModelsForTaskOptions {
  budget?: SdkworkModelRecommendationBudget;
  minContextTokens?: number;
  preferredModalities?: readonly SdkworkModelModality[];
  requiredCapabilities?: readonly SdkworkModelCapability[];
}

export interface SdkworkModelRecommendation {
  model: SdkworkModelCatalogItem;
  reasons: SdkworkModelRecommendationReason[];
  score: number;
}

export interface SdkworkModelsWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "models";
  detailRoutePattern: string;
  purchaseRoutePattern: string;
  routePath: string;
}

export interface CreateModelsWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkModelDetailRouteIntent {
  focusWindow: boolean;
  modelId: string;
  providerId?: string;
  route: string;
  source: "models-catalog";
  type: "model-detail-route-intent";
}

export interface CreateModelDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  providerId?: string;
}

export interface SdkworkModelPurchaseIntent {
  focusWindow: boolean;
  modelId: string;
  route: string;
  source: "models-catalog";
  type: "model-purchase-intent";
}

export interface CreateModelPurchaseIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

const providerMetaMap: Record<string, Omit<SdkworkModelProviderMeta, "id">> = {
  anthropic: {
    label: "Anthropic",
    officialUrl: "https://docs.anthropic.com/en/docs/about-claude/models/overview",
    region: "us",
    tone: "amber",
  },
  deepseek: {
    label: "DeepSeek",
    region: "china",
    tone: "teal",
  },
  google: {
    label: "Google",
    officialUrl: "https://ai.google.dev/gemini-api/docs/models",
    region: "us",
    tone: "sky",
  },
  openai: {
    label: "OpenAI",
    officialUrl: "https://platform.openai.com/docs/models",
    region: "us",
    tone: "emerald",
  },
  qwen: {
    label: "Qwen",
    region: "china",
    tone: "cyan",
  },
  zhipu: {
    label: "Zhipu",
    region: "china",
    tone: "rose",
  },
} as const;

function toWords(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function includesNormalized(value: string | undefined, query: string): boolean {
  return Boolean(value?.toLowerCase().includes(query));
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function contextTokens(model: SdkworkModelCatalogItem): number {
  return model.contextWindowTokens ?? 0;
}

function sortScore(model: SdkworkModelCatalogItem): number {
  let score = 0;

  if (model.isFeatured) {
    score += 100_000;
  }

  switch (model.status) {
    case "available":
      score += 20_000;
      break;
    case "preview":
      score += 10_000;
      break;
    case "deprecated":
      score += 5_000;
      break;
    default:
      break;
  }

  if (model.isPopular) {
    score += 8_000;
  }

  score += Math.floor(contextTokens(model) / 1_000);

  if (model.pricing.tier === "enterprise") {
    score -= 3_000;
  }

  return score;
}

function tierRank(tier: SdkworkSubscriptionTier): number {
  switch (tier) {
    case "free":
      return 0;
    case "standard":
      return 1;
    case "pro":
      return 2;
    case "enterprise":
      return 3;
    default:
      return 0;
  }
}

function matchesEveryCapability(
  model: SdkworkModelCatalogItem,
  requiredCapabilities: readonly SdkworkModelCapability[],
): boolean {
  return requiredCapabilities.every((capability) => model.capabilities.includes(capability));
}

function matchesEveryModality(
  model: SdkworkModelCatalogItem,
  modalities: readonly SdkworkModelModality[],
): boolean {
  return modalities.every((modality) => model.modalities.includes(modality));
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

export function getModelProviderMeta(providerId: string): SdkworkModelProviderMeta {
  const meta = providerMetaMap[providerId];

  if (meta) {
    return {
      id: providerId,
      label: meta.label,
      officialUrl: meta.officialUrl,
      region: meta.region,
      tone: meta.tone,
    };
  }

  return {
    id: providerId,
    label: toWords(providerId),
    region: "global",
    tone: "zinc",
  };
}

export function sortModelCatalog(
  models: readonly SdkworkModelCatalogItem[],
  options: SortModelCatalogOptions = {},
): SdkworkModelCatalogItem[] {
  const mode = options.mode ?? "featured";

  return [...models].sort((left, right) => {
    if (mode === "context-window") {
      const contextDifference = contextTokens(right) - contextTokens(left);
      if (contextDifference !== 0) {
        return contextDifference;
      }
    }

    if (mode === "price-ascending") {
      const leftPrice = left.pricing.inputPerMillionUsd ?? Number.POSITIVE_INFINITY;
      const rightPrice = right.pricing.inputPerMillionUsd ?? Number.POSITIVE_INFINITY;
      if (leftPrice !== rightPrice) {
        return leftPrice - rightPrice;
      }
    }

    if (mode === "name") {
      const nameDifference = left.name.localeCompare(right.name);
      if (nameDifference !== 0) {
        return nameDifference;
      }
    }

    const scoreDifference = sortScore(right) - sortScore(left);
    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return left.name.localeCompare(right.name);
  });
}

export function filterModelCatalog(
  models: readonly SdkworkModelCatalogItem[],
  options: FilterModelCatalogOptions = {},
): SdkworkModelCatalogItem[] {
  const providers = options.providers ? new Set(options.providers) : null;
  const modalities = options.modalities ?? [];
  const capabilities = options.capabilities ?? [];
  const pricingTiers = options.pricingTiers ? new Set(options.pricingTiers) : null;
  const statuses = options.statuses ? new Set(options.statuses) : null;
  const query = normalizeQuery(options.query);

  return sortModelCatalog(models, { mode: options.mode }).filter((model) => {
    if (providers && !providers.has(model.providerId)) {
      return false;
    }

    if (modalities.length > 0 && !matchesEveryModality(model, modalities)) {
      return false;
    }

    if (capabilities.length > 0 && !matchesEveryCapability(model, capabilities)) {
      return false;
    }

    if (pricingTiers && !pricingTiers.has(model.pricing.tier)) {
      return false;
    }

    if (statuses && !statuses.has(model.status)) {
      return false;
    }

    if (options.minContextTokens && contextTokens(model) < options.minContextTokens) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      includesNormalized(model.name, query) ||
      includesNormalized(model.description, query) ||
      includesNormalized(model.providerId, query) ||
      includesNormalized(getModelProviderMeta(model.providerId).label, query)
    );
  });
}

export function summarizeModelCatalog(
  models: readonly SdkworkModelCatalogItem[],
): SdkworkModelCatalogSummary {
  return {
    featuredModels: models.filter((model) => model.isFeatured).length,
    multimodalModels: models.filter((model) => model.modalities.length > 1).length,
    previewModels: models.filter((model) => model.status === "preview").length,
    providerCount: new Set(models.map((model) => model.providerId)).size,
    totalModels: models.length,
  };
}

export function resolveModelAccessState(
  model: SdkworkModelCatalogItem,
  options: ResolveModelAccessStateOptions,
): SdkworkModelAccessState {
  if (model.status === "unavailable" || model.status === "deprecated") {
    return {
      action: "blocked",
      canActivate: false,
      canPurchase: false,
      reason: "status-unavailable",
    };
  }

  if (model.status === "preview" && options.allowPreview === false) {
    return {
      action: "blocked",
      canActivate: false,
      canPurchase: false,
      reason: "preview-disabled",
    };
  }

  if (options.purchasedModelIds?.includes(model.id)) {
    return {
      action: "purchased",
      canActivate: true,
      canPurchase: false,
      reason: undefined,
    };
  }

  const subscriptionRank = tierRank(options.subscriptionTier);
  const requiredTierRank = tierRank(model.accessTier);

  if (model.purchaseMode === "purchase-required") {
    return {
      action: "purchase",
      canActivate: false,
      canPurchase: true,
      reason: "purchase-required",
    };
  }

  if (subscriptionRank < requiredTierRank) {
    return {
      action: "upgrade",
      canActivate: false,
      canPurchase: false,
      reason: "plan-required",
    };
  }

  return {
    action: "included",
    canActivate: true,
    canPurchase: false,
    reason: undefined,
  };
}

export function recommendModelsForTask(
  models: readonly SdkworkModelCatalogItem[],
  options: RecommendModelsForTaskOptions = {},
): SdkworkModelRecommendation[] {
  const requiredCapabilities = options.requiredCapabilities ?? [];
  const preferredModalities = options.preferredModalities ?? [];
  const budget = options.budget ?? "balanced";

  return sortModelCatalog(models)
    .filter((model) => model.status === "available")
    .filter((model) =>
      requiredCapabilities.length === 0 ? true : matchesEveryCapability(model, requiredCapabilities),
    )
    .filter((model) =>
      preferredModalities.length === 0 ? true : preferredModalities.some((modality) => model.modalities.includes(modality)),
    )
    .filter((model) =>
      options.minContextTokens === undefined ? true : contextTokens(model) >= options.minContextTokens,
    )
    .map((model) => {
      const reasons: SdkworkModelRecommendationReason[] = [];
      let score = 0;

      if (requiredCapabilities.length > 0 && matchesEveryCapability(model, requiredCapabilities)) {
        reasons.push("capability-fit");
        score += requiredCapabilities.length * 12;
      }

      if (budget === "economy" && model.pricing.tier === "free") {
        reasons.push("budget-fit");
        score += 8;
      }

      if (budget === "premium" && model.accessTier === "pro") {
        reasons.push("budget-fit");
        score += 8;
      }

      if (budget === "balanced" && model.pricing.tier === "paid") {
        reasons.push("budget-fit");
        score += 8;
      }

      if (options.minContextTokens !== undefined && contextTokens(model) >= options.minContextTokens) {
        reasons.push("context-fit");
        score += 16;
      }

      return {
        model,
        reasons,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return sortScore(right.model) - sortScore(left.model);
    })
    .slice(0, 3);
}

export function createModelsWorkspaceManifest({
  description = "Models workspace for provider catalogs, detail comparison, and purchase routing.",
  host,
  id = "sdkwork-models",
  packageNames = ["@sdkwork/models-pc-react"],
  routePath = "/models",
  theme,
  title = "Models",
}: CreateModelsWorkspaceManifestOptions = {}): SdkworkModelsWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "models",
    detailRoutePattern: `${routePath}/:modelId`,
    purchaseRoutePattern: `${routePath}/:modelId/purchase`,
    routePath,
  };
}

export function createModelDetailRouteIntent(
  modelId: string,
  options: CreateModelDetailRouteIntentOptions = {},
): SdkworkModelDetailRouteIntent {
  const providerSuffix = options.providerId ? `?provider=${encodeURIComponent(options.providerId)}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    modelId,
    providerId: options.providerId,
    route: `${options.basePath ?? "/models"}/${modelId}${providerSuffix}`,
    source: "models-catalog",
    type: "model-detail-route-intent",
  };
}

export function createModelPurchaseIntent(
  modelId: string,
  options: CreateModelPurchaseIntentOptions = {},
): SdkworkModelPurchaseIntent {
  return {
    focusWindow: options.focusWindow !== false,
    modelId,
    route: `${options.basePath ?? "/models"}/${modelId}/purchase`,
    source: "models-catalog",
    type: "model-purchase-intent",
  };
}

export const modelsPackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/models-pc-react",
  status: "ready",
} as const;

export type ModelsPackageMeta = typeof modelsPackageMeta;

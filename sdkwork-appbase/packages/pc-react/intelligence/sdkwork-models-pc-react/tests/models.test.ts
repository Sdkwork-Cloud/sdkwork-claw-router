import { describe, expect, it } from "vitest";
import {
  createModelDetailRouteIntent,
  createModelPurchaseIntent,
  createModelsWorkspaceManifest,
  filterModelCatalog,
  getModelProviderMeta,
  recommendModelsForTask,
  resolveModelAccessState,
  sortModelCatalog,
  summarizeModelCatalog,
  type SdkworkModelCatalogItem,
} from "../src";

const models: SdkworkModelCatalogItem[] = [
  {
    accessTier: "pro",
    capabilities: ["reasoning", "structured-output", "tool-calling", "vision"],
    contextWindowTokens: 400_000,
    id: "gpt-5.4",
    isFeatured: true,
    isPopular: true,
    modalities: ["image", "text"],
    name: "GPT-5.4",
    pricing: {
      inputPerMillionUsd: 2.5,
      outputPerMillionUsd: 10,
      tier: "paid",
    },
    providerId: "openai",
    purchaseMode: "purchase-required",
    status: "available",
  },
  {
    accessTier: "standard",
    capabilities: ["code", "reasoning", "tool-calling"],
    contextWindowTokens: 200_000,
    id: "claude-sonnet-4.5",
    isPopular: true,
    modalities: ["text"],
    name: "Claude Sonnet 4.5",
    pricing: {
      inputPerMillionUsd: 1.4,
      outputPerMillionUsd: 7,
      tier: "paid",
    },
    providerId: "anthropic",
    purchaseMode: "included",
    status: "available",
  },
  {
    accessTier: "free",
    capabilities: ["code", "reasoning"],
    contextWindowTokens: 128_000,
    id: "deepseek-r1",
    modalities: ["text"],
    name: "DeepSeek R1",
    pricing: {
      inputPerMillionUsd: 0.2,
      outputPerMillionUsd: 0.8,
      tier: "free",
    },
    providerId: "deepseek",
    purchaseMode: "included",
    status: "available",
  },
  {
    accessTier: "standard",
    capabilities: ["audio-input", "realtime", "vision"],
    contextWindowTokens: 1_000_000,
    id: "gemini-2.5-flash-live",
    isPopular: true,
    modalities: ["audio", "image", "text"],
    name: "Gemini 2.5 Flash Live",
    pricing: {
      inputPerMillionUsd: 0.35,
      outputPerMillionUsd: 1.2,
      tier: "paid",
    },
    providerId: "google",
    purchaseMode: "included",
    status: "preview",
  },
  {
    accessTier: "enterprise",
    capabilities: ["video-generation"],
    id: "veo-3",
    modalities: ["video"],
    name: "Veo 3",
    pricing: {
      tier: "enterprise",
    },
    providerId: "google",
    purchaseMode: "upgrade-required",
    status: "available",
  },
];

describe("sdkwork-models-pc-react", () => {
  it("returns stable provider metadata and sorts/filters model catalogs", () => {
    expect(getModelProviderMeta("openai")).toEqual({
      id: "openai",
      label: "OpenAI",
      officialUrl: "https://platform.openai.com/docs/models",
      region: "us",
      tone: "emerald",
    });

    expect(sortModelCatalog(models, { mode: "featured" }).map((model) => model.id)).toEqual([
      "gpt-5.4",
      "claude-sonnet-4.5",
      "deepseek-r1",
      "gemini-2.5-flash-live",
      "veo-3",
    ]);

    expect(
      filterModelCatalog(models, {
        capabilities: ["code", "reasoning"],
        minContextTokens: 120_000,
        modalities: ["text"],
        providers: ["anthropic", "deepseek", "openai"],
        statuses: ["available"],
      }).map((model) => model.id),
    ).toEqual([
      "claude-sonnet-4.5",
      "deepseek-r1",
    ]);
  });

  it("summarizes catalogs and resolves purchase/access state", () => {
    expect(summarizeModelCatalog(models)).toEqual({
      featuredModels: 1,
      multimodalModels: 2,
      previewModels: 1,
      providerCount: 4,
      totalModels: 5,
    });

    expect(
      resolveModelAccessState(models[0], {
        purchasedModelIds: [],
        subscriptionTier: "standard",
      }),
    ).toEqual({
      action: "purchase",
      canActivate: false,
      canPurchase: true,
      reason: "purchase-required",
    });

    expect(
      resolveModelAccessState(models[3], {
        allowPreview: false,
        subscriptionTier: "standard",
      }),
    ).toEqual({
      action: "blocked",
      canActivate: false,
      canPurchase: false,
      reason: "preview-disabled",
    });

    expect(
      resolveModelAccessState(models[4], {
        subscriptionTier: "pro",
      }),
    ).toEqual({
      action: "upgrade",
      canActivate: false,
      canPurchase: false,
      reason: "plan-required",
    });
  });

  it("recommends models for task fit using capabilities, context, and budget", () => {
    expect(
      recommendModelsForTask(models, {
        budget: "economy",
        minContextTokens: 100_000,
        preferredModalities: ["text"],
        requiredCapabilities: ["code", "reasoning"],
      }),
    ).toEqual([
      {
        model: models[2],
        reasons: ["capability-fit", "budget-fit", "context-fit"],
        score: 48,
      },
      {
        model: models[1],
        reasons: ["capability-fit", "context-fit"],
        score: 40,
      },
    ]);
  });

  it("creates a models workspace manifest and route intents for catalog flows", () => {
    expect(
      createModelsWorkspaceManifest({
        packageNames: ["@sdkwork/models-pc-react", "@sdkwork/search-pc-react"],
        title: "Models",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "models",
      description: "Models workspace for provider catalogs, detail comparison, and purchase routing.",
      detailRoutePattern: "/models/:modelId",
      host: "tauri",
      id: "sdkwork-models",
      packageNames: ["@sdkwork/models-pc-react", "@sdkwork/search-pc-react"],
      purchaseRoutePattern: "/models/:modelId/purchase",
      routePath: "/models",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Models",
    });

    expect(
      createModelDetailRouteIntent("gpt-5.4", {
        providerId: "openai",
      }),
    ).toEqual({
      focusWindow: true,
      modelId: "gpt-5.4",
      providerId: "openai",
      route: "/models/gpt-5.4?provider=openai",
      source: "models-catalog",
      type: "model-detail-route-intent",
    });

    expect(createModelPurchaseIntent("gpt-5.4")).toEqual({
      focusWindow: true,
      modelId: "gpt-5.4",
      route: "/models/gpt-5.4/purchase",
      source: "models-catalog",
      type: "model-purchase-intent",
    });
  });
});

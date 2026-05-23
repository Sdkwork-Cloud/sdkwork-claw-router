import { describe, expect, it } from "vitest";
import {
  estimateSdkworkGenerationCredits,
  findFirstSdkworkGenerationModelForModality,
  findSdkworkGenerationModelById,
  getSdkworkGenerationDurationOptions,
  getSdkworkGenerationModelBucket,
  updateSdkworkGenerationImageModeConfig,
  type SdkworkGenerationAssetConfig,
  type SdkworkGenerationModelBuckets,
  type SdkworkGenerationPricedModel,
} from "../src/react.ts";

interface TestModel extends SdkworkGenerationPricedModel {
  id: string;
  name: string;
}

function createModel(input: Partial<TestModel> & Pick<TestModel, "id">): TestModel {
  return {
    id: input.id,
    name: input.name ?? input.id,
    officialReferenceCurrency: input.officialReferenceCurrency ?? "USD",
    officialReferencePrices: input.officialReferencePrices ?? [],
    officialReferenceUnitPrice: input.officialReferenceUnitPrice ?? null,
    priceAvailability: input.priceAvailability ?? { status: "reference" },
  };
}

describe("sdkwork-generation-pc-react asset planning", () => {
  it("maps asset modalities to reusable model buckets and duration options", () => {
    expect(getSdkworkGenerationModelBucket("image")).toBe("images");
    expect(getSdkworkGenerationModelBucket("video")).toBe("videos");
    expect(getSdkworkGenerationModelBucket("music")).toBe("music");
    expect(getSdkworkGenerationModelBucket("audio")).toBe("audios");
    expect(getSdkworkGenerationModelBucket("sfx")).toBe("sfx");

    expect(getSdkworkGenerationDurationOptions("image")).toEqual([]);
    expect(getSdkworkGenerationDurationOptions("video")).toEqual([5, 10, 15]);
    expect(getSdkworkGenerationDurationOptions("music")).toEqual([30, 60, 120]);
    expect(getSdkworkGenerationDurationOptions("audio")).toEqual([10, 30, 60]);
    expect(getSdkworkGenerationDurationOptions("sfx")).toEqual([3, 5, 10]);
  });

  it("selects models across reusable generation model buckets", () => {
    const imageModel = createModel({ id: "image-1" });
    const musicModel = createModel({ id: "music-1" });
    const groups: SdkworkGenerationModelBuckets<TestModel>[] = [{
      audios: [],
      images: [imageModel],
      llms: [],
      music: [musicModel],
      sfx: [],
      videos: [],
    }];

    expect(findSdkworkGenerationModelById(groups, "music-1")).toBe(musicModel);
    expect(findSdkworkGenerationModelById(groups, "missing")).toBeNull();
    expect(findFirstSdkworkGenerationModelForModality(groups, "image")).toBe(imageModel);
    expect(findFirstSdkworkGenerationModelForModality(groups, "video")).toBeNull();
  });

  it("estimates credits from the best matching modality meter", () => {
    const model = createModel({
      id: "music-priced",
      officialReferencePrices: [
        { billingMeter: "api_result", currency: "USD", unitPrice: "1" },
        { billingMeter: "audio_output_second", currency: "USD", unitPrice: "0.02" },
      ],
    });
    const config: SdkworkGenerationAssetConfig = {
      aspectRatio: "1:1",
      durationSeconds: 60,
      imageCount: 1,
      quality: "standard",
    };

    expect(estimateSdkworkGenerationCredits({
      config,
      modality: "music",
      model,
    })).toEqual({
      detail: "USD 0.02 x 60 sec",
      points: 12,
      reference: true,
    });
  });

  it("uses image count, pixels, and quality when estimating image metered credits", () => {
    const model = createModel({
      id: "image-priced",
      officialReferencePrices: [
        { billingMeter: "image_megapixel", currency: "USD", unitPrice: "0.01" },
      ],
    });
    const config = updateSdkworkGenerationImageModeConfig({
      aspectRatio: "1:1",
      durationSeconds: 1,
      imageCount: 1,
      quality: "standard",
    }, {
      aspectRatio: "16:9",
      count: 2,
      quality: "2k",
    });

    expect(estimateSdkworkGenerationCredits({
      config,
      modality: "image",
      model,
    })).toEqual({
      detail: "USD 0.01 x 5.505024 MP",
      points: 1,
      reference: true,
    });
  });

  it("falls back to legacy unit price and reports unavailable estimates without a usable price", () => {
    const config: SdkworkGenerationAssetConfig = {
      aspectRatio: "16:9",
      durationSeconds: 10,
      imageCount: 1,
      quality: "standard",
    };

    expect(estimateSdkworkGenerationCredits({
      config,
      modality: "video",
      model: createModel({
        id: "legacy-priced",
        officialReferenceUnitPrice: "0.5",
      }),
    })).toEqual({
      detail: "USD 0.5 x 1 unit",
      points: 5,
      reference: true,
    });

    expect(estimateSdkworkGenerationCredits({
      config,
      modality: "video",
      model: createModel({
        id: "unpriced",
        priceAvailability: { status: "unavailable" },
      }),
    })).toEqual({
      detail: "sdkwork.generation.cost.unavailable",
      points: null,
      reference: false,
    });
  });
});

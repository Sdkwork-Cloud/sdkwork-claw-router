import { describe, expect, it } from "vitest";
import {
  createDefaultSdkworkGenerationAssetConfig,
  createSdkworkGenerationAssetConfigFromSerialized,
  reconcileSdkworkGenerationAssetConfig,
  serializeSdkworkGenerationAssetConfig,
  updateSdkworkGenerationImageModeConfig,
  updateSdkworkGenerationVideoModeConfig,
} from "../src/react.ts";

describe("sdkwork-generation-pc-react asset config", () => {
  it("creates modality-specific defaults that are already reconciled", () => {
    expect(createDefaultSdkworkGenerationAssetConfig("image")).toEqual({
      aspectRatio: "1:1",
      durationSeconds: 1,
      imageCount: 2,
      imageMode: {
        aspectRatio: "auto",
        count: 2,
        quality: "1k",
      },
      quality: "standard",
      videoMode: undefined,
    });
    expect(createDefaultSdkworkGenerationAssetConfig("video")).toEqual({
      aspectRatio: "16:9",
      durationSeconds: 5,
      imageCount: 1,
      imageMode: undefined,
      quality: "standard",
      videoMode: {
        aspectRatio: "16:9",
        count: 1,
        duration: 5,
        resolution: "720p",
        syncAudioVideo: true,
      },
    });
  });

  it("serializes full image mode config while keeping history-safe summary fields", () => {
    const baseConfig = createDefaultSdkworkGenerationAssetConfig("image");
    const config = updateSdkworkGenerationImageModeConfig(baseConfig, {
      aspectRatio: "21:9",
      count: 4,
      quality: "2k",
    });

    expect(serializeSdkworkGenerationAssetConfig(config, "image")).toEqual({
      aspectRatio: "1:1",
      durationSeconds: 1,
      imageCount: 4,
      imageMode: {
        aspectRatio: "21:9",
        count: 4,
        quality: "2k",
      },
      quality: "high",
    });
  });

  it("serializes full video mode config into runtime request payload fields", () => {
    const baseConfig = createDefaultSdkworkGenerationAssetConfig("video");
    const config = updateSdkworkGenerationVideoModeConfig(baseConfig, {
      aspectRatio: "9:16",
      count: 1,
      duration: 12,
      resolution: "1080p",
      syncAudioVideo: false,
    });

    expect(serializeSdkworkGenerationAssetConfig(config, "video")).toEqual({
      aspectRatio: "9:16",
      durationSeconds: 12,
      imageCount: 1,
      quality: "standard",
      resolution: "1080p",
      syncAudioVideo: false,
      videoMode: {
        aspectRatio: "9:16",
        count: 1,
        duration: 12,
        resolution: "1080p",
        syncAudioVideo: false,
      },
    });
  });

  it("resets image generation config to image defaults when switching from another modality", () => {
    const videoConfig = updateSdkworkGenerationVideoModeConfig(createDefaultSdkworkGenerationAssetConfig("video"), {
      aspectRatio: "9:16",
      count: 1,
      duration: 12,
      resolution: "1080p",
      syncAudioVideo: false,
    });

    expect(reconcileSdkworkGenerationAssetConfig(videoConfig, "image")).toEqual(
      createDefaultSdkworkGenerationAssetConfig("image"),
    );
  });

  it("resets non-image generation config to modality defaults when switching away from video", () => {
    const videoConfig = updateSdkworkGenerationVideoModeConfig(createDefaultSdkworkGenerationAssetConfig("video"), {
      aspectRatio: "9:16",
      count: 1,
      duration: 12,
      resolution: "1080p",
      syncAudioVideo: false,
    });

    expect(reconcileSdkworkGenerationAssetConfig(videoConfig, "audio")).toEqual(
      createDefaultSdkworkGenerationAssetConfig("audio"),
    );
  });

  it("restores image asset config from serialized mode config", () => {
    expect(createSdkworkGenerationAssetConfigFromSerialized({
      aspectRatio: "9:16",
      durationSeconds: 1,
      imageCount: 3,
      imageMode: {
        aspectRatio: "9:16",
        count: 3,
        quality: "2k",
      },
      quality: "high",
    }, "image")).toEqual({
      aspectRatio: "9:16",
      durationSeconds: 1,
      imageCount: 3,
      imageMode: {
        aspectRatio: "9:16",
        count: 3,
        quality: "2k",
      },
      quality: "high",
      videoMode: undefined,
    });
  });

  it("restores video asset config from history-safe summary fields", () => {
    expect(createSdkworkGenerationAssetConfigFromSerialized({
      aspectRatio: "9:16",
      durationSeconds: 8,
      resolution: "1080p",
      syncAudioVideo: false,
    }, "video")).toEqual({
      aspectRatio: "9:16",
      durationSeconds: 8,
      imageCount: 1,
      imageMode: undefined,
      quality: "standard",
      videoMode: {
        aspectRatio: "9:16",
        count: 1,
        duration: 8,
        resolution: "1080p",
        syncAudioVideo: false,
      },
    });
  });
});

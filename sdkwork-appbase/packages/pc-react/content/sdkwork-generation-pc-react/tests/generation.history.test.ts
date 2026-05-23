import { describe, expect, it } from "vitest";
import {
  appendSdkworkGenerationArtifactToHistoryItem,
  createSdkworkGenerationPendingHistoryItem,
  getSdkworkGenerationPreviewKind,
  mapSdkworkGenerationArtifactsToHistoryMedia,
  mapSdkworkGenerationModalityToHistoryType,
  mapSdkworkGenerationHistoryTypeToModality,
  readSdkworkGenerationMediaUrl,
  restoreSdkworkGenerationSerializedConfigFromHistoryItem,
  type SdkworkGenerationArtifact,
  type SdkworkGenerationHistoryItem,
} from "../src/react.ts";

describe("sdkwork-generation-pc-react history helpers", () => {
  it("maps history item types and preview kinds across text and asset modalities", () => {
    expect(mapSdkworkGenerationModalityToHistoryType(undefined)).toBe("text");
    expect(mapSdkworkGenerationModalityToHistoryType("image")).toBe("images");
    expect(mapSdkworkGenerationModalityToHistoryType("video")).toBe("video");

    expect(mapSdkworkGenerationHistoryTypeToModality("text")).toBeUndefined();
    expect(mapSdkworkGenerationHistoryTypeToModality("image")).toBe("image");
    expect(mapSdkworkGenerationHistoryTypeToModality("images")).toBe("image");
    expect(mapSdkworkGenerationHistoryTypeToModality("music")).toBe("music");

    expect(getSdkworkGenerationPreviewKind("text")).toBe("text");
    expect(getSdkworkGenerationPreviewKind("images")).toBe("image");
    expect(getSdkworkGenerationPreviewKind("video")).toBe("video");
    expect(getSdkworkGenerationPreviewKind("audio")).toBe("audio");
    expect(getSdkworkGenerationPreviewKind("sfx")).toBe("audio");
  });

  it("creates pending history items with serialized generation config summaries", () => {
    expect(createSdkworkGenerationPendingHistoryItem({
      createdAt: "2026-05-22T00:00:00Z",
      generationConfig: {
        aspectRatio: "9:16",
        durationSeconds: 8,
        imageCount: 1,
      },
      id: "pending-1",
      prompt: "Create a vertical clip",
      selectedModel: "video-model",
      targetType: "video",
    })).toEqual({
      aspectRatio: "9:16",
      createdAt: "2026-05-22T00:00:00Z",
      date: "2026-05-22",
      durationSeconds: 8,
      generationConfig: {
        aspectRatio: "9:16",
        durationSeconds: 8,
        imageCount: 1,
      },
      id: "pending-1",
      images: [],
      modelCatalogKey: "video-model",
      modelInfo: "video-model",
      outputText: "",
      prompt: "Create a vertical clip",
      status: "processing",
      type: "video",
      updatedAt: "2026-05-22T00:00:00Z",
      videos: [],
    });
  });

  it("restores serialized asset config from full config or history-safe summary fields", () => {
    const imageHistory: SdkworkGenerationHistoryItem = {
      date: "2026-05-22",
      id: "image-history",
      images: ["https://cdn.example/one.png", "https://cdn.example/two.png"],
      prompt: "Two square images",
      type: "images",
    };
    expect(restoreSdkworkGenerationSerializedConfigFromHistoryItem(imageHistory)).toEqual({
      aspectRatio: "1:1",
      durationSeconds: 1,
      imageCount: 2,
      imageMode: {
        aspectRatio: "1:1",
        count: 2,
        quality: "1k",
      },
      quality: "standard",
    });

    const videoHistory: SdkworkGenerationHistoryItem = {
      aspectRatio: "9:16",
      date: "2026-05-22",
      durationSeconds: 12,
      generationConfig: {
        aspectRatio: "9:16",
        durationSeconds: 12,
        resolution: "1080p",
        syncAudioVideo: false,
      },
      id: "video-history",
      prompt: "Clip",
      type: "video",
    };
    expect(restoreSdkworkGenerationSerializedConfigFromHistoryItem(videoHistory)).toEqual({
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

  it("maps artifacts into history media collections for the requested modality", () => {
    const artifacts: SdkworkGenerationArtifact[] = [
      { modality: "image", url: "https://cdn.example/a.png" },
      { durationSeconds: 6, modality: "video", thumb: "https://cdn.example/v.jpg", url: "https://cdn.example/v.mp4" },
    ];

    expect(mapSdkworkGenerationArtifactsToHistoryMedia(artifacts, "image")).toEqual({
      durationSeconds: undefined,
      images: ["https://cdn.example/a.png"],
      url: "https://cdn.example/a.png",
      videos: [],
    });
    expect(mapSdkworkGenerationArtifactsToHistoryMedia(artifacts, "video")).toEqual({
      durationSeconds: 6,
      images: [],
      url: "https://cdn.example/v.mp4",
      videos: [{ thumb: "https://cdn.example/v.jpg", url: "https://cdn.example/v.mp4" }],
    });
    expect(readSdkworkGenerationMediaUrl({ thumb: "thumb", url: "video" })).toBe("video");
    expect(readSdkworkGenerationMediaUrl("image")).toBe("image");
  });

  it("appends streamed artifacts to history items without duplicating existing media", () => {
    const base: SdkworkGenerationHistoryItem = {
      createdAt: "2026-05-22T00:00:00Z",
      date: "2026-05-22",
      id: "pending",
      images: [],
      prompt: "Generate",
      type: "text",
      updatedAt: "2026-05-22T00:00:00Z",
      videos: [],
    };
    const imageArtifact: SdkworkGenerationArtifact = {
      modality: "image",
      url: "https://cdn.example/image.png",
    };
    const withImage = appendSdkworkGenerationArtifactToHistoryItem(base, imageArtifact, {
      updatedAt: "2026-05-22T00:00:01Z",
    });
    expect(withImage).toMatchObject({
      images: ["https://cdn.example/image.png"],
      status: "processing",
      type: "images",
      updatedAt: "2026-05-22T00:00:01Z",
      url: "https://cdn.example/image.png",
    });
    expect(appendSdkworkGenerationArtifactToHistoryItem(withImage, imageArtifact, {
      updatedAt: "2026-05-22T00:00:02Z",
    })).toMatchObject({
      images: ["https://cdn.example/image.png"],
      updatedAt: "2026-05-22T00:00:02Z",
    });

    const withAudio = appendSdkworkGenerationArtifactToHistoryItem(base, {
      durationSeconds: 4,
      modality: "sfx",
      url: "https://cdn.example/sfx.wav",
    }, {
      updatedAt: "2026-05-22T00:00:03Z",
    });
    expect(withAudio).toMatchObject({
      durationSeconds: 4,
      status: "processing",
      type: "sfx",
      updatedAt: "2026-05-22T00:00:03Z",
      url: "https://cdn.example/sfx.wav",
    });
  });
});

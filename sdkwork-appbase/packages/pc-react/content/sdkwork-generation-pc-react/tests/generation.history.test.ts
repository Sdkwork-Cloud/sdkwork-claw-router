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
  type SdkworkGenerationMediaResource,
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
      images: [
        mediaResource("image", "https://cdn.example/one.png"),
        mediaResource("image", "https://cdn.example/two.png"),
      ],
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
      { modality: "image", asset: mediaResource("image", "https://cdn.example/a.png") },
      { modality: "video", asset: videoResource("https://cdn.example/v.mp4", "https://cdn.example/v.jpg", 6) },
    ];

    expect(mapSdkworkGenerationArtifactsToHistoryMedia(artifacts, "image")).toEqual({
      asset: mediaResource("image", "https://cdn.example/a.png"),
      durationSeconds: undefined,
      images: [mediaResource("image", "https://cdn.example/a.png")],
      videos: [],
    });
    expect(mapSdkworkGenerationArtifactsToHistoryMedia(artifacts, "video")).toEqual({
      asset: videoResource("https://cdn.example/v.mp4", "https://cdn.example/v.jpg", 6),
      durationSeconds: 6,
      images: [],
      videos: [videoResource("https://cdn.example/v.mp4", "https://cdn.example/v.jpg", 6)],
    });
    expect(readSdkworkGenerationMediaUrl(videoResource("video", "thumb"))).toBe("video");
    expect(readSdkworkGenerationMediaUrl(mediaResource("image", "image"))).toBe("image");
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
      asset: mediaResource("image", "https://cdn.example/image.png"),
      modality: "image",
    };
    const withImage = appendSdkworkGenerationArtifactToHistoryItem(base, imageArtifact, {
      updatedAt: "2026-05-22T00:00:01Z",
    });
    expect(withImage).toMatchObject({
      asset: mediaResource("image", "https://cdn.example/image.png"),
      images: [mediaResource("image", "https://cdn.example/image.png")],
      status: "processing",
      type: "images",
      updatedAt: "2026-05-22T00:00:01Z",
    });
    expect(appendSdkworkGenerationArtifactToHistoryItem(withImage, imageArtifact, {
      updatedAt: "2026-05-22T00:00:02Z",
    })).toMatchObject({
      images: [mediaResource("image", "https://cdn.example/image.png")],
      updatedAt: "2026-05-22T00:00:02Z",
    });

    const withAudio = appendSdkworkGenerationArtifactToHistoryItem(base, {
      asset: mediaResource("audio", "https://cdn.example/sfx.wav", 4),
      modality: "sfx",
    }, {
      updatedAt: "2026-05-22T00:00:03Z",
    });
    expect(withAudio).toMatchObject({
      asset: mediaResource("audio", "https://cdn.example/sfx.wav", 4),
      durationSeconds: 4,
      status: "processing",
      type: "sfx",
      updatedAt: "2026-05-22T00:00:03Z",
    });
  });
});

function mediaResource(
  kind: "audio" | "image" | "video",
  url: string,
  durationSeconds?: number,
): SdkworkGenerationMediaResource {
  return {
    kind,
    source: "external_url",
    url,
    publicUrl: url,
    ...(durationSeconds === undefined ? {} : { durationSeconds }),
  };
}

function videoResource(
  url: string,
  poster: string,
  durationSeconds?: number,
): SdkworkGenerationMediaResource {
  const thumbnail = mediaResource("image", poster);
  return {
    ...mediaResource("video", url, durationSeconds),
    poster: thumbnail,
    thumbnails: [thumbnail],
  };
}

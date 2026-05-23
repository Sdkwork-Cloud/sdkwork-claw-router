import { describe, expect, it } from "vitest";
import * as videoModule from "../src";

describe("sdkwork-video-pc-react domain contract", () => {
  it("creates workspace manifest, route intents, and deterministic video workspace", () => {
    const {
      createEmptySdkworkVideoWorkspace,
      createVideoRouteIntent,
      createVideoWorkspaceManifest,
      videoPackageMeta,
    } = videoModule as Record<string, any>;

    expect(videoPackageMeta).toMatchObject({
      domain: "content",
      package: "@sdkwork/video-pc-react",
      status: "ready",
    });

    expect(createVideoWorkspaceManifest({ title: "Video Workspace" })).toMatchObject({
      capability: "video",
      routePath: "/video",
      title: "Video Workspace",
    });

    expect(createVideoRouteIntent({ videoId: "video-launch-cut", presetId: "launch-teaser" })).toEqual({
      focusWindow: true,
      presetId: "launch-teaser",
      route: "/video?presetId=launch-teaser&videoId=video-launch-cut",
      source: "video-workspace",
      type: "video-route-intent",
      videoId: "video-launch-cut",
    });

    expect(createEmptySdkworkVideoWorkspace()).toMatchObject({
      digest: {
        presetCount: 3,
        totalVideos: 4,
      },
      isAuthenticated: false,
      presets: expect.arrayContaining([
        expect.objectContaining({ id: "launch-teaser" }),
      ]),
    });
  });
});

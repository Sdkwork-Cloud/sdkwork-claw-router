import { describe, expect, it } from "vitest";
import * as mediaModule from "../src";

describe("sdkwork-media-pc-react domain contract", () => {
  it("creates workspace manifest, route intents, and deterministic media workspace", () => {
    const {
      createEmptySdkworkMediaWorkspace,
      createMediaRouteIntent,
      createMediaWorkspaceManifest,
      mediaPackageMeta,
    } = mediaModule as Record<string, any>;

    expect(mediaPackageMeta).toMatchObject({
      domain: "content",
      package: "@sdkwork/media-pc-react",
      status: "ready",
    });

    expect(
      createMediaWorkspaceManifest({
        title: "Media Control Room",
      }),
    ).toMatchObject({
      capability: "media",
      routePath: "/media",
      title: "Media Control Room",
    });

    expect(
      createMediaRouteIntent({
        itemId: "media-launch-teaser",
        queueId: "launch-review",
      }),
    ).toEqual({
      focusWindow: true,
      itemId: "media-launch-teaser",
      queueId: "launch-review",
      route: "/media?queueId=launch-review&itemId=media-launch-teaser",
      source: "media-workspace",
      type: "media-route-intent",
    });

    const workspace = createEmptySdkworkMediaWorkspace();

    expect(workspace).toMatchObject({
      digest: {
        queueCount: 3,
        totalItems: 4,
      },
      isAuthenticated: false,
      queues: expect.arrayContaining([
        expect.objectContaining({ id: "launch-review" }),
      ]),
    });
    expect(workspace.items[0]).toMatchObject({
      resource: {
        kind: "video",
        source: "generated",
      },
    });
  });
});

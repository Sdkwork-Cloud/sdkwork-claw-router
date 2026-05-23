import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as videoModule from "../src";

describe("sdkwork-video-pc-react intl", () => {
  it("lets standalone video components consume host overrides through the intl provider", () => {
    const VideoIntlProvider = (videoModule as Record<string, any>).SdkworkVideoIntlProvider;
    const VideoGallery = (videoModule as Record<string, any>).SdkworkVideoGallery;

    expect(VideoIntlProvider).toBeTypeOf("function");

    if (typeof VideoIntlProvider !== "function") {
      return;
    }

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <VideoIntlProvider
          messages={{
            empty: {
              noVideosDescription: "Host video empty description",
              noVideosTitle: "Host video empty",
            },
          }}
        >
          <VideoGallery videos={[]} />
        </VideoIntlProvider>
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("Host video empty")).toBeInTheDocument();
    expect(screen.getByText("Host video empty description")).toBeInTheDocument();
  });

  it("localizes gallery status labels and scene count copy through the video intl seam", () => {
    const VideoIntlProvider = (videoModule as Record<string, any>).SdkworkVideoIntlProvider;
    const VideoGallery = (videoModule as Record<string, any>).SdkworkVideoGallery;

    expect(VideoIntlProvider).toBeTypeOf("function");

    if (typeof VideoIntlProvider !== "function") {
      return;
    }

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <VideoIntlProvider
          messages={{
            gallery: {
              scenePlural: "sequences",
              sceneSingular: "sequence",
            },
            status: {
              ready: "Prepared",
            },
          }}
        >
          <VideoGallery
            videos={[
              {
                durationLabel: "00:45",
                id: "video-launch-cut",
                presetId: "launch-teaser",
                resolution: "1920x1080",
                sceneCount: 1,
                status: "ready",
                title: "Launch Cut",
                updatedAt: "2026-04-03T01:00:00.000Z",
              },
            ]}
          />
        </VideoIntlProvider>
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("Prepared")).toBeInTheDocument();
    expect(screen.getByText(/1 sequence/i)).toBeInTheDocument();
  });
});

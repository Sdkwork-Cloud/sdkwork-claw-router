import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as mediaModule from "../src";

describe("sdkwork-media-pc-react intl", () => {
  it("lets standalone media components consume host overrides through the intl provider", () => {
    const MediaIntlProvider = (mediaModule as Record<string, any>).SdkworkMediaIntlProvider;
    const MediaItemGrid = (mediaModule as Record<string, any>).SdkworkMediaItemGrid;

    expect(MediaIntlProvider).toBeTypeOf("function");

    if (typeof MediaIntlProvider !== "function") {
      return;
    }

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MediaIntlProvider
          messages={{
            empty: {
              noItemsDescription: "Host media empty description",
              noItemsTitle: "Host media empty",
            },
          }}
        >
          <MediaItemGrid items={[]} />
        </MediaIntlProvider>
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("Host media empty")).toBeInTheDocument();
    expect(screen.getByText("Host media empty description")).toBeInTheDocument();
  });

  it("localizes media kind and publish posture labels through the media intl seam", () => {
    const MediaIntlProvider = (mediaModule as Record<string, any>).SdkworkMediaIntlProvider;
    const MediaItemGrid = (mediaModule as Record<string, any>).SdkworkMediaItemGrid;

    expect(MediaIntlProvider).toBeTypeOf("function");

    if (typeof MediaIntlProvider !== "function") {
      return;
    }

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MediaIntlProvider
          messages={{
            kind: {
              video: "Clip",
            },
            publishPosture: {
              ready: "Publish-ready",
            },
          }}
        >
          <MediaItemGrid
            items={[
              {
                durationLabel: "00:45",
                id: "media-launch-teaser",
                kind: "video",
                publishPosture: "ready",
                queueId: "launch-review",
                title: "Launch Teaser",
                updatedAt: "2026-04-03T03:30:00.000Z",
              },
            ]}
          />
        </MediaIntlProvider>
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("Clip")).toBeInTheDocument();
    expect(screen.getByText(/00:45 \| Publish-ready/i)).toBeInTheDocument();
  });
});

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import * as distributionModule from "../src";

const channels = [
  {
    approvalRequired: true,
    artifactIds: ["artifact-win-x64", "artifact-linux-x64"],
    description: "Progressive production release channel.",
    id: "stable-global",
    riskLevel: "low",
    rolloutPercent: 30,
    targetScope: {
      regions: ["global"],
      tenantRings: ["production"],
    },
    title: "Stable",
    type: "stable",
  },
  {
    approvalRequired: false,
    artifactIds: ["artifact-linux-x64"],
    description: "Preview release channel.",
    id: "preview-regional",
    riskLevel: "medium",
    rolloutPercent: 10,
    targetScope: {
      regions: ["cn", "global"],
      tenantRings: ["preview"],
    },
    title: "Preview",
    type: "preview",
  },
];

const channelDigests = {
  "preview-regional": {
    approvalPending: 1,
    blockedArtifacts: 0,
    readyArtifacts: 0,
  },
  "stable-global": {
    approvalPending: 2,
    blockedArtifacts: 0,
    readyArtifacts: 1,
  },
};

describe("sdkwork-distribution-pc-react channel cards", () => {
  it("renders channels, supports selection, and dispatches route navigation", () => {
    const DistributionChannelCards = (distributionModule as Record<string, any>).SdkworkDistributionChannelCards;
    const onNavigate = vi.fn();
    const onSelectChannel = vi.fn();

    expect(DistributionChannelCards).toBeTypeOf("function");

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <DistributionChannelCards
          channelDigests={channelDigests}
          channels={channels}
          onNavigate={onNavigate}
          onSelectChannel={onSelectChannel}
          selectedChannelId="stable-global"
        />
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("Stable")).toBeTruthy();
    expect(screen.getByText("Preview")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: /select preview/i,
      }),
    );
    expect(onSelectChannel).toHaveBeenCalledWith("preview-regional");

    fireEvent.click(
      screen.getByRole("button", {
        name: /open channel route for stable/i,
      }),
    );
    expect(onNavigate).toHaveBeenCalledWith("/distribution?channelId=stable-global");
  });
});

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import { SdkworkTerminalSessionList } from "../src";

describe("sdkwork-terminal-pc-react session list", () => {
  it("renders sessions and dispatches open/select actions", () => {
    const onOpenSession = vi.fn();
    const onSelectSession = vi.fn();

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkTerminalSessionList
          onOpenSession={onOpenSession}
          onSelectSession={onSelectSession}
          profiles={[
            {
              defaultCwd: "/workspace",
              id: "profile-workspace-shell",
              name: "Workspace Shell",
              persistent: true,
              riskPosture: "standard",
              shell: "bash",
            },
          ]}
          selectedSessionId="session-running"
          sessions={[
            {
              history: [],
              id: "session-running",
              lastActivityAt: "2026-04-03T09:00:00.000Z",
              permissionReadiness: "ready",
              profileId: "profile-workspace-shell",
              route: "/terminal?sessionId=session-running",
              runtimeHealth: "healthy",
              state: "running",
              title: "Workspace Main",
              workingDirectory: "/workspace",
            },
            {
              history: [],
              id: "session-release",
              lastActivityAt: "2026-04-03T08:00:00.000Z",
              permissionReadiness: "review",
              profileId: "profile-workspace-shell",
              route: "/terminal?sessionId=session-release",
              runtimeHealth: "degraded",
              state: "idle",
              title: "Release Terminal",
              workingDirectory: "/workspace/release",
            },
          ]}
        />
      </SdkworkThemeProvider>,
    );

    expect(screen.getByText("Workspace Main")).toBeInTheDocument();
    expect(screen.getByText("Release Terminal")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /select release terminal/i }));
    expect(onSelectSession).toHaveBeenCalledWith("session-release");

    fireEvent.click(screen.getByRole("button", { name: /open release terminal/i }));
    expect(onOpenSession).toHaveBeenCalledWith("/terminal?sessionId=session-release");
  });
});

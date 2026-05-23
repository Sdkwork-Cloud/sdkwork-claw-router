import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import {
  createEmptySdkworkTerminalWorkspace,
  SdkworkTerminalPage,
} from "../src";

describe("sdkwork-terminal-pc-react page", () => {
  it("renders terminal workspace, filters sessions, and routes open action", async () => {
    const onNavigate = vi.fn();

    const fullWorkspace = createEmptySdkworkTerminalWorkspace({
      profiles: [
        {
          defaultCwd: "/workspace",
          id: "profile-workspace-shell",
          name: "Workspace Shell",
          persistent: true,
          riskPosture: "standard",
          shell: "bash",
        },
        {
          defaultCwd: "/workspace/release",
          id: "profile-release-powershell",
          name: "Release PowerShell",
          persistent: true,
          riskPosture: "elevated",
          shell: "powershell",
        },
      ],
      sessions: [
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
          profileId: "profile-release-powershell",
          route: "/terminal?sessionId=session-release",
          runtimeHealth: "degraded",
          state: "idle",
          title: "Release Terminal",
          workingDirectory: "/workspace/release",
        },
      ],
    });

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkTerminalPage
          onNavigate={onNavigate}
          service={{
            getEmptyWorkspace: vi.fn().mockReturnValue(
              createEmptySdkworkTerminalWorkspace({
                profiles: fullWorkspace.profiles,
                sessions: fullWorkspace.sessions.slice(0, 1),
              }),
            ),
            getWorkspace: vi.fn().mockResolvedValue(fullWorkspace),
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        name: /terminal workspace/i,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /release powershell/i }));
    expect(screen.getAllByText("Release Terminal").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /select release terminal/i }));
    fireEvent.click(screen.getAllByRole("button", { name: /open release terminal/i })[0]);
    expect(onNavigate).toHaveBeenCalledWith("/terminal?sessionId=session-release");
    expect(container.innerHTML).not.toContain("bg-white/8");
    expect(container.innerHTML).not.toContain("text-white/75");
    expect(container.innerHTML).not.toContain("text-white/65");
  });
});

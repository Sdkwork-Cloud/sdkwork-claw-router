import { describe, expect, it, vi } from "vitest";
import {
  createEmptySdkworkTerminalWorkspace,
  createSdkworkTerminalController,
} from "../src";

describe("sdkwork-terminal-pc-react controller", () => {
  it("bootstraps terminal workspace and applies profile/state/health/search filters", async () => {
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

    const controller = createSdkworkTerminalController({
      service: {
        getEmptyWorkspace: vi.fn().mockReturnValue(
          createEmptySdkworkTerminalWorkspace({
            profiles: fullWorkspace.profiles,
            sessions: fullWorkspace.sessions.slice(0, 1),
          }),
        ),
        getWorkspace: vi.fn().mockResolvedValue(fullWorkspace),
      },
    });

    expect(controller.getState().visibleSessions).toHaveLength(1);
    await controller.bootstrap();
    expect(controller.getState().visibleSessions).toHaveLength(2);

    controller.setProfileId("profile-release-powershell");
    expect(controller.getState().visibleSessions.map((session) => session.id)).toEqual(["session-release"]);

    controller.setStateFilter("idle");
    expect(controller.getState().visibleSessions.map((session) => session.id)).toEqual(["session-release"]);

    controller.setHealthFilter("degraded");
    expect(controller.getState().visibleSessions.map((session) => session.id)).toEqual(["session-release"]);

    controller.setSearchQuery("workspace main");
    expect(controller.getState().visibleSessions).toHaveLength(0);

    controller.setProfileId("all");
    controller.setStateFilter("all");
    controller.setHealthFilter("all");
    controller.setSearchQuery("release");
    expect(controller.getState().visibleSessions.map((session) => session.id)).toEqual(["session-release"]);
  });
});

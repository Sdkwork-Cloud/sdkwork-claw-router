import { describe, expect, it, vi } from "vitest";
import { createSdkworkTerminalService } from "../src";

describe("sdkwork-terminal-pc-react service", () => {
  it("uses runtime auth posture and falls back when session list calls reject", async () => {
    const listSessions = vi.fn()
      .mockResolvedValueOnce([
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
      ])
      .mockRejectedValueOnce(new Error("offline"));

    const service = createSdkworkTerminalService({
      fallbackProfiles: [
        {
          defaultCwd: "/workspace",
          id: "profile-workspace-shell",
          name: "Workspace Shell",
          persistent: true,
          riskPosture: "standard",
          shell: "bash",
        },
      ],
      fallbackSessions: [
        {
          history: [],
          id: "session-fallback",
          lastActivityAt: "2026-04-02T09:00:00.000Z",
          permissionReadiness: "review",
          profileId: "profile-workspace-shell",
          route: "/terminal?sessionId=session-fallback",
          runtimeHealth: "degraded",
          state: "idle",
          title: "Fallback Session",
          workingDirectory: "/workspace",
        },
      ],
      getSessionTokens: () => ({ authToken: "token" }),
      listSessions,
      workspaceId: "workspace-1",
    });

    const first = await service.getWorkspace();
    expect(first.context.isAuthenticated).toBe(true);
    expect(first.context.workspaceId).toBe("workspace-1");
    expect(first.sessions[0]?.id).toBe("session-running");

    const second = await service.getWorkspace();
    expect(second.sessions[0]?.id).toBe("session-fallback");
    expect(second.summary.sessionCount).toBe(1);
  });
});

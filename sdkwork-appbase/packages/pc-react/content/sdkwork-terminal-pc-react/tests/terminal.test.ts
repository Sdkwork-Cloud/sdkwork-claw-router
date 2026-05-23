import { describe, expect, it } from "vitest";
import * as terminalModule from "../src";

function createSession(overrides: Record<string, unknown> = {}) {
  return {
    history: [],
    id: "session",
    lastActivityAt: "2026-04-03T01:00:00.000Z",
    permissionReadiness: "ready",
    profileId: "profile-workspace-shell",
    route: "/terminal?sessionId=session",
    runtimeHealth: "healthy",
    state: "running",
    title: "Session",
    workingDirectory: "/workspace",
    ...overrides,
  };
}

describe("sdkwork-terminal-pc-react domain contract", () => {
  it("creates terminal manifest, route intent, filter/sort, and deterministic workspace summary", () => {
    const {
      createEmptySdkworkTerminalWorkspace,
      createTerminalRouteIntent,
      createTerminalWorkspaceManifest,
      filterSdkworkTerminalSessions,
      sortSdkworkTerminalSessions,
      summarizeSdkworkTerminalWorkspace,
      terminalPackageMeta,
    } = terminalModule as Record<string, any>;

    expect(terminalPackageMeta).toMatchObject({
      domain: "content",
      package: "@sdkwork/terminal-pc-react",
      status: "ready",
    });

    expect(createTerminalWorkspaceManifest({ title: "Terminal Workspace" })).toMatchObject({
      capability: "terminal",
      routePath: "/terminal",
      title: "Terminal Workspace",
    });

    expect(
      createTerminalRouteIntent({
        profileId: "profile-release-powershell",
        sessionId: "session-release",
        state: "idle",
      }),
    ).toEqual({
      focusWindow: true,
      profileId: "profile-release-powershell",
      route: "/terminal?profileId=profile-release-powershell&state=idle&sessionId=session-release",
      sessionId: "session-release",
      source: "terminal-workspace",
      state: "idle",
      type: "terminal-route-intent",
    });

    const sessions = sortSdkworkTerminalSessions([
      createSession({
        id: "session-running",
        state: "running",
        title: "Running Session",
      }),
      createSession({
        id: "session-idle",
        runtimeHealth: "degraded",
        state: "idle",
        title: "Idle Session",
      }),
      createSession({
        id: "session-error",
        runtimeHealth: "offline",
        state: "error",
        title: "Error Session",
      }),
    ]);

    expect(sessions.map((session: { id: string }) => session.id)).toEqual([
      "session-running",
      "session-idle",
      "session-error",
    ]);

    const filtered = filterSdkworkTerminalSessions(sessions, {
      activeHealth: "degraded",
      activeProfileId: "all",
      activeState: "all",
      query: "idle",
      sortBy: "recent",
    });
    expect(filtered.map((session: { id: string }) => session.id)).toEqual(["session-idle"]);

    const summary = summarizeSdkworkTerminalWorkspace(sessions, [
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
    ]);
    expect(summary).toMatchObject({
      errorSessions: 1,
      profileCount: 2,
      runningSessions: 1,
      sessionCount: 3,
    });

    const workspace = createEmptySdkworkTerminalWorkspace();
    expect(workspace.sessions.length).toBeGreaterThanOrEqual(3);
    expect(workspace.profiles.length).toBeGreaterThanOrEqual(3);
    expect(workspace.summary.sessionCount).toBeGreaterThanOrEqual(3);
  });
});

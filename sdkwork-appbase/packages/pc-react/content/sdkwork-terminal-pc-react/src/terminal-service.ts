import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkTerminalWorkspace,
  type SdkworkTerminalProfile,
  type SdkworkTerminalSession,
  type SdkworkTerminalWorkspaceData,
} from "./terminal";

export interface CreateSdkworkTerminalServiceOptions {
  fallbackProfiles?: readonly SdkworkTerminalProfile[];
  fallbackSessions?: readonly SdkworkTerminalSession[];
  getSessionTokens?: () => {
    authToken?: string;
  };
  listProfiles?: () => Promise<readonly SdkworkTerminalProfile[]>;
  listSessions?: () => Promise<readonly SdkworkTerminalSession[]>;
  workspaceId?: string;
}

export interface SdkworkTerminalService {
  getEmptyWorkspace(): SdkworkTerminalWorkspaceData;
  getWorkspace(): Promise<SdkworkTerminalWorkspaceData>;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function resolveSettledValue<T>(
  result: PromiseSettledResult<T>,
  fallback: T,
): T {
  return result.status === "fulfilled" ? result.value : fallback;
}

export function createSdkworkTerminalService(
  options: CreateSdkworkTerminalServiceOptions = {},
): SdkworkTerminalService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());
  const fallbackWorkspace = createEmptySdkworkTerminalWorkspace({
    context: {
      workspaceId: options.workspaceId,
    },
    profiles: options.fallbackProfiles,
    sessions: options.fallbackSessions,
  });

  return {
    getEmptyWorkspace() {
      return createEmptySdkworkTerminalWorkspace({
        context: {
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          workspaceId: options.workspaceId,
        },
        profiles: options.fallbackProfiles ?? fallbackWorkspace.profiles,
        sessions: options.fallbackSessions ?? fallbackWorkspace.sessions,
      });
    },

    async getWorkspace() {
      const isAuthenticated = Boolean(normalizeText(getSessionTokens().authToken));

      if (!options.listSessions && !options.listProfiles) {
        return createEmptySdkworkTerminalWorkspace({
          context: {
            isAuthenticated,
            workspaceId: options.workspaceId,
          },
          profiles: options.fallbackProfiles ?? fallbackWorkspace.profiles,
          sessions: options.fallbackSessions ?? fallbackWorkspace.sessions,
        });
      }

      const [sessionsResult, profilesResult] = await Promise.allSettled([
        options.listSessions ? options.listSessions() : Promise.resolve(options.fallbackSessions ?? fallbackWorkspace.sessions),
        options.listProfiles ? options.listProfiles() : Promise.resolve(options.fallbackProfiles ?? fallbackWorkspace.profiles),
      ]);

      const sessions = resolveSettledValue(sessionsResult, options.fallbackSessions ?? fallbackWorkspace.sessions);
      const profiles = resolveSettledValue(profilesResult, options.fallbackProfiles ?? fallbackWorkspace.profiles);

      return createEmptySdkworkTerminalWorkspace({
        context: {
          isAuthenticated,
          workspaceId: options.workspaceId,
        },
        profiles,
        sessions,
      });
    },
  };
}

export const sdkworkTerminalService = createSdkworkTerminalService();

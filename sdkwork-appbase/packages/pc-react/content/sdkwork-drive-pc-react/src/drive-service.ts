import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createDefaultSdkworkDriveLocations,
  createDefaultSdkworkDriveRecentActions,
  createEmptySdkworkDriveWorkspace,
  type SdkworkDriveEntry,
  type SdkworkDriveLocation,
  type SdkworkDriveRecentAction,
  type SdkworkDriveWorkspaceData,
} from "./drive";

export interface CreateSdkworkDriveServiceOptions {
  entries?: readonly SdkworkDriveEntry[];
  getSessionTokens?: () => { authToken?: string };
  listEntries?: () => Promise<readonly SdkworkDriveEntry[]>;
  locations?: readonly SdkworkDriveLocation[];
  recentActions?: readonly SdkworkDriveRecentAction[];
}

export interface SdkworkDriveService {
  getEmptyWorkspace(): SdkworkDriveWorkspaceData;
  getWorkspace(): Promise<SdkworkDriveWorkspaceData>;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function createSdkworkDriveService(
  options: CreateSdkworkDriveServiceOptions = {},
): SdkworkDriveService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());

  return {
    getEmptyWorkspace() {
      return createEmptySdkworkDriveWorkspace({
        entries: options.entries,
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        locations: options.locations ?? createDefaultSdkworkDriveLocations(),
        recentActions: options.recentActions ?? createDefaultSdkworkDriveRecentActions(),
      });
    },

    async getWorkspace() {
      try {
        const entries = options.listEntries ? await options.listEntries() : options.entries;
        return createEmptySdkworkDriveWorkspace({
          entries,
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          locations: options.locations ?? createDefaultSdkworkDriveLocations(),
          recentActions: options.recentActions ?? createDefaultSdkworkDriveRecentActions(),
        });
      } catch {
        return createEmptySdkworkDriveWorkspace({
          entries: options.entries,
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          locations: options.locations ?? createDefaultSdkworkDriveLocations(),
          recentActions: options.recentActions ?? createDefaultSdkworkDriveRecentActions(),
        });
      }
    },
  };
}

export const sdkworkDriveService = createSdkworkDriveService();

import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createDefaultSdkworkVideoPresets,
  createEmptySdkworkVideoWorkspace,
  type SdkworkVideoAsset,
  type SdkworkVideoPreset,
  type SdkworkVideoWorkspaceData,
} from "./video";

export interface CreateSdkworkVideoServiceOptions {
  getSessionTokens?: () => { authToken?: string };
  listVideos?: () => Promise<readonly SdkworkVideoAsset[]>;
  presets?: readonly SdkworkVideoPreset[];
  videos?: readonly SdkworkVideoAsset[];
}

export interface SdkworkVideoService {
  getEmptyWorkspace(): SdkworkVideoWorkspaceData;
  getWorkspace(): Promise<SdkworkVideoWorkspaceData>;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function createSdkworkVideoService(options: CreateSdkworkVideoServiceOptions = {}): SdkworkVideoService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());

  return {
    getEmptyWorkspace() {
      return createEmptySdkworkVideoWorkspace({
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        presets: options.presets ?? createDefaultSdkworkVideoPresets(),
        videos: options.videos,
      });
    },

    async getWorkspace() {
      try {
        const videos = options.listVideos ? await options.listVideos() : options.videos;
        return createEmptySdkworkVideoWorkspace({
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          presets: options.presets ?? createDefaultSdkworkVideoPresets(),
          videos,
        });
      } catch {
        return createEmptySdkworkVideoWorkspace({
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          presets: options.presets ?? createDefaultSdkworkVideoPresets(),
          videos: options.videos,
        });
      }
    },
  };
}

export const sdkworkVideoService = createSdkworkVideoService();

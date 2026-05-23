import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createDefaultSdkworkAudioVoices,
  createEmptySdkworkAudioWorkspace,
  type SdkworkAudioAsset,
  type SdkworkAudioVoice,
  type SdkworkAudioWorkspaceData,
} from "./audio";

export interface CreateSdkworkAudioServiceOptions {
  getSessionTokens?: () => { authToken?: string };
  items?: readonly SdkworkAudioAsset[];
  listAudio?: () => Promise<readonly SdkworkAudioAsset[]>;
  voices?: readonly SdkworkAudioVoice[];
}

export interface SdkworkAudioService {
  getEmptyWorkspace(): SdkworkAudioWorkspaceData;
  getWorkspace(): Promise<SdkworkAudioWorkspaceData>;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function createSdkworkAudioService(options: CreateSdkworkAudioServiceOptions = {}): SdkworkAudioService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());

  return {
    getEmptyWorkspace() {
      return createEmptySdkworkAudioWorkspace({
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        items: options.items,
        voices: options.voices ?? createDefaultSdkworkAudioVoices(),
      });
    },

    async getWorkspace() {
      try {
        const items = options.listAudio ? await options.listAudio() : options.items;
        return createEmptySdkworkAudioWorkspace({
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          items,
          voices: options.voices ?? createDefaultSdkworkAudioVoices(),
        });
      } catch {
        return createEmptySdkworkAudioWorkspace({
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          items: options.items,
          voices: options.voices ?? createDefaultSdkworkAudioVoices(),
        });
      }
    },
  };
}

export const sdkworkAudioService = createSdkworkAudioService();

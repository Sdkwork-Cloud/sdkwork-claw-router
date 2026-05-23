import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createDefaultSdkworkMediaQueues,
  createEmptySdkworkMediaWorkspace,
  type SdkworkMediaItem,
  type SdkworkMediaQueue,
  type SdkworkMediaWorkspaceData,
} from "./media";

export interface CreateSdkworkMediaServiceOptions {
  getSessionTokens?: () => { authToken?: string };
  items?: readonly SdkworkMediaItem[];
  listItems?: () => Promise<readonly SdkworkMediaItem[]>;
  queues?: readonly SdkworkMediaQueue[];
}

export interface SdkworkMediaService {
  getEmptyWorkspace(): SdkworkMediaWorkspaceData;
  getWorkspace(): Promise<SdkworkMediaWorkspaceData>;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function createSdkworkMediaService(options: CreateSdkworkMediaServiceOptions = {}): SdkworkMediaService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());

  return {
    getEmptyWorkspace() {
      return createEmptySdkworkMediaWorkspace({
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        items: options.items,
        queues: options.queues ?? createDefaultSdkworkMediaQueues(),
      });
    },

    async getWorkspace() {
      try {
        const items = options.listItems ? await options.listItems() : options.items;
        return createEmptySdkworkMediaWorkspace({
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          items,
          queues: options.queues ?? createDefaultSdkworkMediaQueues(),
        });
      } catch {
        return createEmptySdkworkMediaWorkspace({
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          items: options.items,
          queues: options.queues ?? createDefaultSdkworkMediaQueues(),
        });
      }
    },
  };
}

export const sdkworkMediaService = createSdkworkMediaService();

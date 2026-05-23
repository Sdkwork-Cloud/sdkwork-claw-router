import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkPluginRegistry,
  type SdkworkPlugin,
  type SdkworkPluginRegistryData,
} from "./plugin";

export interface CreateSdkworkPluginServiceOptions {
  fallbackPlugins?: readonly SdkworkPlugin[];
  getSessionTokens?: () => {
    authToken?: string;
  };
  listPlugins?: () => Promise<readonly SdkworkPlugin[]>;
  workspaceId?: string;
}

export interface SdkworkPluginService {
  getEmptyRegistry(): SdkworkPluginRegistryData;
  getRegistry(): Promise<SdkworkPluginRegistryData>;
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

export function createSdkworkPluginService(
  options: CreateSdkworkPluginServiceOptions = {},
): SdkworkPluginService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());
  const fallbackRegistry = createEmptySdkworkPluginRegistry({
    context: {
      workspaceId: options.workspaceId,
    },
    plugins: options.fallbackPlugins,
  });

  return {
    getEmptyRegistry() {
      return createEmptySdkworkPluginRegistry({
        context: {
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          workspaceId: options.workspaceId,
        },
        plugins: options.fallbackPlugins ?? fallbackRegistry.plugins,
      });
    },

    async getRegistry() {
      const hasSession = Boolean(normalizeText(getSessionTokens().authToken));

      if (!options.listPlugins) {
        return createEmptySdkworkPluginRegistry({
          context: {
            isAuthenticated: hasSession,
            workspaceId: options.workspaceId,
          },
          plugins: options.fallbackPlugins ?? fallbackRegistry.plugins,
        });
      }

      const listResult = await Promise.allSettled([options.listPlugins()]);
      const plugins = resolveSettledValue(listResult[0], options.fallbackPlugins ?? fallbackRegistry.plugins);

      return createEmptySdkworkPluginRegistry({
        context: {
          isAuthenticated: hasSession,
          workspaceId: options.workspaceId,
        },
        plugins,
      });
    },
  };
}

export const sdkworkPluginService = createSdkworkPluginService();

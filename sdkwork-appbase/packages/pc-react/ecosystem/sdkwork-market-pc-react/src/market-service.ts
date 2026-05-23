import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkMarketCatalog,
  type SdkworkMarketCatalogData,
  type SdkworkMarketItem,
} from "./market";

export interface CreateSdkworkMarketServiceOptions {
  fallbackItems?: readonly SdkworkMarketItem[];
  getSessionTokens?: () => {
    authToken?: string;
  };
  listItems?: () => Promise<readonly SdkworkMarketItem[]>;
  workspaceId?: string;
}

export interface SdkworkMarketService {
  getCatalog(): Promise<SdkworkMarketCatalogData>;
  getEmptyCatalog(): SdkworkMarketCatalogData;
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

export function createSdkworkMarketService(
  options: CreateSdkworkMarketServiceOptions = {},
): SdkworkMarketService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());
  const fallbackCatalog = createEmptySdkworkMarketCatalog({
    context: {
      workspaceId: options.workspaceId,
    },
    items: options.fallbackItems,
  });

  return {
    async getCatalog() {
      const hasSession = Boolean(normalizeText(getSessionTokens().authToken));
      if (!options.listItems) {
        return createEmptySdkworkMarketCatalog({
          context: {
            isAuthenticated: hasSession,
            workspaceId: options.workspaceId,
          },
          items: options.fallbackItems ?? fallbackCatalog.items,
        });
      }

      const listResult = await Promise.allSettled([options.listItems()]);
      const items = resolveSettledValue(listResult[0], options.fallbackItems ?? fallbackCatalog.items);

      return createEmptySdkworkMarketCatalog({
        context: {
          isAuthenticated: hasSession,
          workspaceId: options.workspaceId,
        },
        items,
      });
    },

    getEmptyCatalog() {
      return createEmptySdkworkMarketCatalog({
        context: {
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          workspaceId: options.workspaceId,
        },
        items: options.fallbackItems ?? fallbackCatalog.items,
      });
    },
  };
}

export const sdkworkMarketService = createSdkworkMarketService();

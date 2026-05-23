import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkIotCatalog,
  type SdkworkIotAlert,
  type SdkworkIotCatalogData,
  type SdkworkIotNode,
} from "./iot";

export interface GetSdkworkIotCatalogInput {
  nodeId?: string | null;
}

export interface CreateSdkworkIotServiceOptions {
  alerts?: readonly SdkworkIotAlert[];
  getSessionTokens?: () => {
    authToken?: string;
  };
  nodes?: readonly SdkworkIotNode[];
}

export interface SdkworkIotService {
  getCatalog(input?: GetSdkworkIotCatalogInput): Promise<SdkworkIotCatalogData>;
  getEmptyCatalog(input?: GetSdkworkIotCatalogInput): SdkworkIotCatalogData;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function createSdkworkIotService(
  options: CreateSdkworkIotServiceOptions = {},
): SdkworkIotService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());

  return {
    async getCatalog(input = {}) {
      return createEmptySdkworkIotCatalog({
        alerts: options.alerts,
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        nodes: options.nodes,
        selectedNodeId: input.nodeId ?? null,
      });
    },

    getEmptyCatalog(input = {}) {
      return createEmptySdkworkIotCatalog({
        alerts: options.alerts,
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        nodes: options.nodes,
        selectedNodeId: input.nodeId ?? null,
      });
    },
  };
}

export const sdkworkIotService = createSdkworkIotService();

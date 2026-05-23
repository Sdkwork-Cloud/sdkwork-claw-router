import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkCanvasWorkspace,
  type SdkworkCanvasBoard,
  type SdkworkCanvasWorkspaceData,
} from "./canvas";

export interface CreateSdkworkCanvasServiceOptions {
  boards?: readonly SdkworkCanvasBoard[];
  getSessionTokens?: () => {
    authToken?: string;
  };
  listBoards?: () => Promise<readonly SdkworkCanvasBoard[]>;
}

export interface SdkworkCanvasService {
  getEmptyWorkspace(): SdkworkCanvasWorkspaceData;
  getWorkspace(): Promise<SdkworkCanvasWorkspaceData>;
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

export function createSdkworkCanvasService(
  options: CreateSdkworkCanvasServiceOptions = {},
): SdkworkCanvasService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());
  const fallbackWorkspace = createEmptySdkworkCanvasWorkspace({
    boards: options.boards,
  });

  return {
    getEmptyWorkspace() {
      return createEmptySdkworkCanvasWorkspace({
        boards: options.boards ?? fallbackWorkspace.boards,
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
      });
    },

    async getWorkspace() {
      const isAuthenticated = Boolean(normalizeText(getSessionTokens().authToken));

      if (!options.listBoards) {
        return createEmptySdkworkCanvasWorkspace({
          boards: options.boards ?? fallbackWorkspace.boards,
          isAuthenticated,
        });
      }

      const results = await Promise.allSettled([options.listBoards()]);
      const boards = resolveSettledValue(results[0], options.boards ?? fallbackWorkspace.boards);

      return createEmptySdkworkCanvasWorkspace({
        boards,
        isAuthenticated,
      });
    },
  };
}

export const sdkworkCanvasService = createSdkworkCanvasService();

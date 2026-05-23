import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkEditorWorkspace,
  type SdkworkEditorDocument,
  type SdkworkEditorWorkspaceData,
} from "./editor";

export interface CreateSdkworkEditorServiceOptions {
  documents?: readonly SdkworkEditorDocument[];
  getSessionTokens?: () => {
    authToken?: string;
  };
  listDocuments?: () => Promise<readonly SdkworkEditorDocument[]>;
}

export interface SdkworkEditorService {
  getEmptyWorkspace(): SdkworkEditorWorkspaceData;
  getWorkspace(): Promise<SdkworkEditorWorkspaceData>;
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

export function createSdkworkEditorService(
  options: CreateSdkworkEditorServiceOptions = {},
): SdkworkEditorService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());
  const fallbackWorkspace = createEmptySdkworkEditorWorkspace({
    documents: options.documents,
  });

  return {
    getEmptyWorkspace() {
      return createEmptySdkworkEditorWorkspace({
        documents: options.documents ?? fallbackWorkspace.documents,
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
      });
    },

    async getWorkspace() {
      const hasSession = Boolean(normalizeText(getSessionTokens().authToken));

      if (!options.listDocuments) {
        return createEmptySdkworkEditorWorkspace({
          documents: options.documents ?? fallbackWorkspace.documents,
          isAuthenticated: hasSession,
        });
      }

      const listResults = await Promise.allSettled([options.listDocuments()]);
      const documents = resolveSettledValue(
        listResults[0],
        options.documents ?? fallbackWorkspace.documents,
      );

      return createEmptySdkworkEditorWorkspace({
        documents,
        isAuthenticated: hasSession,
      });
    },
  };
}

export const sdkworkEditorService = createSdkworkEditorService();

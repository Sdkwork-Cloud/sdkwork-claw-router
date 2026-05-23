import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkNotesWorkspace,
  type SdkworkNoteEntry,
  type SdkworkNoteNotebook,
  type SdkworkNotesWorkspaceData,
} from "./notes";

export interface CreateSdkworkNotesServiceOptions {
  getSessionTokens?: () => {
    authToken?: string;
  };
  listNotes?: () => Promise<readonly SdkworkNoteEntry[]>;
  notebooks?: readonly SdkworkNoteNotebook[];
  notes?: readonly SdkworkNoteEntry[];
}

export interface SdkworkNotesService {
  getEmptyWorkspace(): SdkworkNotesWorkspaceData;
  getWorkspace(): Promise<SdkworkNotesWorkspaceData>;
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

export function createSdkworkNotesService(
  options: CreateSdkworkNotesServiceOptions = {},
): SdkworkNotesService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());
  const fallbackWorkspace = createEmptySdkworkNotesWorkspace({
    notebooks: options.notebooks,
    notes: options.notes,
  });

  return {
    getEmptyWorkspace() {
      return createEmptySdkworkNotesWorkspace({
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        notebooks: options.notebooks ?? fallbackWorkspace.notebooks,
        notes: options.notes ?? fallbackWorkspace.notes,
      });
    },

    async getWorkspace() {
      const isAuthenticated = Boolean(normalizeText(getSessionTokens().authToken));
      if (!options.listNotes) {
        return createEmptySdkworkNotesWorkspace({
          isAuthenticated,
          notebooks: options.notebooks ?? fallbackWorkspace.notebooks,
          notes: options.notes ?? fallbackWorkspace.notes,
        });
      }

      const results = await Promise.allSettled([options.listNotes()]);
      const notes = resolveSettledValue(
        results[0],
        options.notes ?? fallbackWorkspace.notes,
      );

      return createEmptySdkworkNotesWorkspace({
        isAuthenticated,
        notebooks: options.notebooks ?? fallbackWorkspace.notebooks,
        notes,
      });
    },
  };
}

export const sdkworkNotesService = createSdkworkNotesService();

import {
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  sortSdkworkEditorDocuments,
  type SdkworkEditorDocument,
  type SdkworkEditorDocumentMode,
  type SdkworkEditorSortBy,
  type SdkworkEditorWorkspaceData,
} from "./editor";
import {
  createSdkworkEditorService,
  type SdkworkEditorService,
} from "./editor-service";

export interface SdkworkEditorControllerState {
  activeMode: SdkworkEditorDocumentMode | "all";
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  searchQuery: string;
  selectedDocument: SdkworkEditorDocument | null;
  selectedDocumentId: string | null;
  sortBy: SdkworkEditorSortBy;
  visibleDocuments: SdkworkEditorDocument[];
  workspace: SdkworkEditorWorkspaceData;
}

export interface SdkworkEditorController {
  bootstrap(): Promise<SdkworkEditorControllerState>;
  getState(): SdkworkEditorControllerState;
  refresh(): Promise<SdkworkEditorControllerState>;
  selectDocument(documentId: string | null): void;
  service: SdkworkEditorService;
  setMode(mode: SdkworkEditorDocumentMode | "all"): void;
  setSearchQuery(query: string): void;
  setSortBy(sortBy: SdkworkEditorSortBy): void;
  subscribe(listener: () => void): () => void;
}

export interface CreateSdkworkEditorControllerOptions {
  initialState?: Partial<SdkworkEditorControllerState>;
  service?: Partial<SdkworkEditorService>;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function filterDocuments(
  documents: readonly SdkworkEditorDocument[],
  activeMode: SdkworkEditorDocumentMode | "all",
  query: string,
  sortBy: SdkworkEditorSortBy,
): SdkworkEditorDocument[] {
  const normalizedQuery = normalizeText(query);

  const filtered = documents.filter((document) => {
    if (activeMode !== "all" && document.mode !== activeMode) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [
      document.id,
      document.title,
      document.summary,
      document.path,
      ...document.tags,
    ].some((value) => normalizeText(value).includes(normalizedQuery));
  });

  return sortSdkworkEditorDocuments(filtered, sortBy);
}

function resolveSelectedDocumentId(
  documents: readonly SdkworkEditorDocument[],
  selectedDocumentId: string | null,
): string | null {
  if (selectedDocumentId && documents.some((document) => document.id === selectedDocumentId)) {
    return selectedDocumentId;
  }

  return documents.find((document) => document.status === "draft")?.id
    ?? documents[0]?.id
    ?? null;
}

function normalizeState(
  state: SdkworkEditorControllerState,
): SdkworkEditorControllerState {
  const visibleDocuments = filterDocuments(
    state.workspace.documents,
    state.activeMode,
    state.searchQuery,
    state.sortBy,
  );
  const selectedDocumentId = resolveSelectedDocumentId(
    visibleDocuments,
    state.selectedDocumentId,
  );

  return {
    ...state,
    selectedDocument: visibleDocuments.find((document) => document.id === selectedDocumentId) ?? null,
    selectedDocumentId,
    visibleDocuments,
  };
}

export function createSdkworkEditorController(
  options: CreateSdkworkEditorControllerOptions = {},
): SdkworkEditorController {
  const service: SdkworkEditorService = options.service
    ? {
        ...createSdkworkEditorService(),
        ...options.service,
      }
    : createSdkworkEditorService();
  const fallbackWorkspace = service.getEmptyWorkspace();
  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeMode: "all",
    isBootstrapped: false,
    isLoading: false,
    searchQuery: "",
    selectedDocument: null,
    selectedDocumentId: null,
    sortBy: "recent",
    visibleDocuments: fallbackWorkspace.documents,
    workspace: fallbackWorkspace,
    ...options.initialState,
  });

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkEditorControllerState>
      | ((currentState: SdkworkEditorControllerState) => Partial<SdkworkEditorControllerState>),
  ): void {
    const partial = typeof next === "function" ? next(state) : next;
    state = normalizeState({
      ...state,
      ...partial,
    });
    emit();
  }

  return {
    async bootstrap() {
      setState({
        isLoading: true,
        lastError: undefined,
      });

      try {
        const workspace = await service.getWorkspace();
        setState({
          isBootstrapped: true,
          isLoading: false,
          workspace,
        });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : "Failed to load editor workspace.",
        });
        throw error;
      }
    },

    getState() {
      return state;
    },

    async refresh() {
      const workspace = await service.getWorkspace();
      setState({
        isBootstrapped: true,
        isLoading: false,
        workspace,
      });
      return state;
    },

    selectDocument(documentId) {
      setState({
        selectedDocumentId: documentId,
      });
    },

    service,

    setMode(mode) {
      setState({
        activeMode: mode,
      });
    },

    setSearchQuery(query) {
      setState({
        searchQuery: query,
      });
    },

    setSortBy(sortBy) {
      setState({
        sortBy,
      });
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export function useSdkworkEditorController(
  controller?: SdkworkEditorController,
  service?: Partial<SdkworkEditorService>,
): SdkworkEditorController {
  return useMemo(
    () => controller ?? createSdkworkEditorController(service ? { service } : undefined),
    [controller, service],
  );
}

export function useSdkworkEditorControllerState(
  controller: SdkworkEditorController,
): SdkworkEditorControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

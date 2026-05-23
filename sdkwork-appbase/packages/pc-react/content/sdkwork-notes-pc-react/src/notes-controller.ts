import {
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  sortSdkworkNotes,
  type SdkworkNoteEntry,
  type SdkworkNoteSortBy,
  type SdkworkNotesWorkspaceData,
} from "./notes";
import {
  createSdkworkNotesService,
  type SdkworkNotesService,
} from "./notes-service";

export interface SdkworkNotesControllerState {
  activeNotebookId: string | "all";
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  searchQuery: string;
  selectedNote: SdkworkNoteEntry | null;
  selectedNoteId: string | null;
  showStarredOnly: boolean;
  sortBy: SdkworkNoteSortBy;
  visibleNotes: SdkworkNoteEntry[];
  workspace: SdkworkNotesWorkspaceData;
}

export interface SdkworkNotesController {
  bootstrap(): Promise<SdkworkNotesControllerState>;
  getState(): SdkworkNotesControllerState;
  refresh(): Promise<SdkworkNotesControllerState>;
  selectNote(noteId: string | null): void;
  service: SdkworkNotesService;
  setNotebook(notebookId: string | "all"): void;
  setSearchQuery(query: string): void;
  setShowStarredOnly(value: boolean): void;
  setSortBy(sortBy: SdkworkNoteSortBy): void;
  subscribe(listener: () => void): () => void;
}

export interface CreateSdkworkNotesControllerOptions {
  initialState?: Partial<SdkworkNotesControllerState>;
  service?: Partial<SdkworkNotesService>;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function filterNotes(
  notes: readonly SdkworkNoteEntry[],
  state: Pick<SdkworkNotesControllerState, "activeNotebookId" | "searchQuery" | "showStarredOnly" | "sortBy">,
): SdkworkNoteEntry[] {
  const query = normalizeText(state.searchQuery);
  const filtered = notes.filter((note) => {
    if (state.activeNotebookId !== "all" && note.notebookId !== state.activeNotebookId) {
      return false;
    }
    if (state.showStarredOnly && !note.starred) {
      return false;
    }
    if (!query) {
      return true;
    }

    return [
      note.id,
      note.title,
      note.preview,
      ...note.tags,
    ].some((value) => normalizeText(value).includes(query));
  });

  return sortSdkworkNotes(filtered, state.sortBy);
}

function resolveSelectedNoteId(
  notes: readonly SdkworkNoteEntry[],
  selectedNoteId: string | null,
): string | null {
  if (selectedNoteId && notes.some((note) => note.id === selectedNoteId)) {
    return selectedNoteId;
  }

  return notes.find((note) => note.starred)?.id
    ?? notes[0]?.id
    ?? null;
}

function normalizeState(state: SdkworkNotesControllerState): SdkworkNotesControllerState {
  const visibleNotes = filterNotes(state.workspace.notes, {
    activeNotebookId: state.activeNotebookId,
    searchQuery: state.searchQuery,
    showStarredOnly: state.showStarredOnly,
    sortBy: state.sortBy,
  });
  const selectedNoteId = resolveSelectedNoteId(visibleNotes, state.selectedNoteId);

  return {
    ...state,
    selectedNote: visibleNotes.find((note) => note.id === selectedNoteId) ?? null,
    selectedNoteId,
    visibleNotes,
  };
}

export function createSdkworkNotesController(
  options: CreateSdkworkNotesControllerOptions = {},
): SdkworkNotesController {
  const service: SdkworkNotesService = options.service
    ? {
        ...createSdkworkNotesService(),
        ...options.service,
      }
    : createSdkworkNotesService();
  const fallbackWorkspace = service.getEmptyWorkspace();
  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeNotebookId: "all",
    isBootstrapped: false,
    isLoading: false,
    searchQuery: "",
    selectedNote: null,
    selectedNoteId: null,
    showStarredOnly: false,
    sortBy: "recent",
    visibleNotes: fallbackWorkspace.notes,
    workspace: fallbackWorkspace,
    ...options.initialState,
  });

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkNotesControllerState>
      | ((currentState: SdkworkNotesControllerState) => Partial<SdkworkNotesControllerState>),
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
          lastError: error instanceof Error ? error.message : "Failed to load notes workspace.",
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

    selectNote(noteId) {
      setState({
        selectedNoteId: noteId,
      });
    },

    service,

    setNotebook(notebookId) {
      setState({
        activeNotebookId: notebookId,
      });
    },

    setSearchQuery(query) {
      setState({
        searchQuery: query,
      });
    },

    setShowStarredOnly(value) {
      setState({
        showStarredOnly: value,
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

export function useSdkworkNotesController(
  controller?: SdkworkNotesController,
  service?: Partial<SdkworkNotesService>,
): SdkworkNotesController {
  return useMemo(
    () => controller ?? createSdkworkNotesController(service ? { service } : undefined),
    [controller, service],
  );
}

export function useSdkworkNotesControllerState(
  controller: SdkworkNotesController,
): SdkworkNotesControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

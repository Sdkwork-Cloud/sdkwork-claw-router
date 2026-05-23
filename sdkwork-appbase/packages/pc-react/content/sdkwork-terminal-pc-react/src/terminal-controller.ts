import {
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  filterSdkworkTerminalSessions,
  type SdkworkTerminalRuntimeHealth,
  type SdkworkTerminalSession,
  type SdkworkTerminalSessionState,
  type SdkworkTerminalSortBy,
  type SdkworkTerminalWorkspaceData,
} from "./terminal";
import {
  createSdkworkTerminalService,
  type SdkworkTerminalService,
} from "./terminal-service";

export interface SdkworkTerminalControllerState {
  activeHealth: SdkworkTerminalRuntimeHealth | "all";
  activeProfileId: string;
  activeState: SdkworkTerminalSessionState | "all";
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  searchQuery: string;
  selectedSession: SdkworkTerminalSession | null;
  selectedSessionId: string | null;
  sortBy: SdkworkTerminalSortBy;
  visibleSessions: SdkworkTerminalSession[];
  workspace: SdkworkTerminalWorkspaceData;
}

export interface SdkworkTerminalController {
  bootstrap(): Promise<SdkworkTerminalControllerState>;
  getState(): SdkworkTerminalControllerState;
  refresh(): Promise<SdkworkTerminalControllerState>;
  selectSession(sessionId: string | null): void;
  service: SdkworkTerminalService;
  setHealthFilter(health: SdkworkTerminalRuntimeHealth | "all"): void;
  setProfileId(profileId: string): void;
  setSearchQuery(query: string): void;
  setSortBy(sortBy: SdkworkTerminalSortBy): void;
  setStateFilter(stateFilter: SdkworkTerminalSessionState | "all"): void;
  subscribe(listener: () => void): () => void;
}

export interface CreateSdkworkTerminalControllerOptions {
  initialState?: Partial<SdkworkTerminalControllerState>;
  service?: Partial<SdkworkTerminalService>;
}

function deriveVisibleSessions(
  workspace: SdkworkTerminalWorkspaceData,
  state: Pick<SdkworkTerminalControllerState, "activeHealth" | "activeProfileId" | "activeState" | "searchQuery" | "sortBy">,
): SdkworkTerminalSession[] {
  return filterSdkworkTerminalSessions(workspace.sessions, {
    activeHealth: state.activeHealth,
    activeProfileId: state.activeProfileId,
    activeState: state.activeState,
    query: state.searchQuery,
    sortBy: state.sortBy,
  });
}

function resolveSelectedSessionId(
  sessions: readonly SdkworkTerminalSession[],
  selectedSessionId: string | null,
): string | null {
  if (selectedSessionId && sessions.some((session) => session.id === selectedSessionId)) {
    return selectedSessionId;
  }

  return sessions.find((session) => session.state === "running")?.id
    ?? sessions[0]?.id
    ?? null;
}

function normalizeState(
  state: SdkworkTerminalControllerState,
): SdkworkTerminalControllerState {
  const visibleSessions = deriveVisibleSessions(state.workspace, state);
  const selectedSessionId = resolveSelectedSessionId(visibleSessions, state.selectedSessionId);

  return {
    ...state,
    selectedSession: visibleSessions.find((session) => session.id === selectedSessionId) ?? null,
    selectedSessionId,
    visibleSessions,
  };
}

export function createSdkworkTerminalController(
  options: CreateSdkworkTerminalControllerOptions = {},
): SdkworkTerminalController {
  const service: SdkworkTerminalService = options.service
    ? {
        ...createSdkworkTerminalService(),
        ...options.service,
      }
    : createSdkworkTerminalService();

  const fallbackWorkspace = service.getEmptyWorkspace();
  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeHealth: "all",
    activeProfileId: "all",
    activeState: "all",
    isBootstrapped: false,
    isLoading: false,
    searchQuery: "",
    selectedSession: null,
    selectedSessionId: null,
    sortBy: "recent",
    visibleSessions: fallbackWorkspace.sessions,
    workspace: fallbackWorkspace,
    ...options.initialState,
  });

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkTerminalControllerState>
      | ((currentState: SdkworkTerminalControllerState) => Partial<SdkworkTerminalControllerState>),
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
          selectedSessionId: state.selectedSessionId,
          workspace,
        });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : "Failed to load terminal workspace.",
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
        selectedSessionId: state.selectedSessionId,
        workspace,
      });
      return state;
    },

    selectSession(sessionId) {
      setState({
        selectedSessionId: sessionId,
      });
    },

    service,

    setHealthFilter(health) {
      setState({
        activeHealth: health,
      });
    },

    setProfileId(profileId) {
      setState({
        activeProfileId: profileId,
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

    setStateFilter(stateFilter) {
      setState({
        activeState: stateFilter,
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

export function useSdkworkTerminalController(
  controller?: SdkworkTerminalController,
  service?: Partial<SdkworkTerminalService>,
): SdkworkTerminalController {
  return useMemo(
    () => controller ?? createSdkworkTerminalController(service ? { service } : undefined),
    [controller, service],
  );
}

export function useSdkworkTerminalControllerState(
  controller: SdkworkTerminalController,
): SdkworkTerminalControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

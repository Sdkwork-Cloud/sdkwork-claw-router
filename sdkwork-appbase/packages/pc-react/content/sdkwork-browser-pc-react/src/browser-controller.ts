import {
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  filterSdkworkBrowserTabs,
  type SdkworkBrowserSafeMode,
  type SdkworkBrowserSortBy,
  type SdkworkBrowserTab,
  type SdkworkBrowserWorkspaceData,
} from "./browser";
import {
  createSdkworkBrowserService,
  type SdkworkBrowserService,
} from "./browser-service";

export interface SdkworkBrowserControllerState {
  activeGroupId: string;
  activeSafeMode: SdkworkBrowserSafeMode | "all";
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  searchQuery: string;
  selectedTab: SdkworkBrowserTab | null;
  selectedTabId: string | null;
  sortBy: SdkworkBrowserSortBy;
  visibleTabs: SdkworkBrowserTab[];
  workspace: SdkworkBrowserWorkspaceData;
}

export interface SdkworkBrowserController {
  bootstrap(): Promise<SdkworkBrowserControllerState>;
  getState(): SdkworkBrowserControllerState;
  refresh(): Promise<SdkworkBrowserControllerState>;
  selectTab(tabId: string | null): void;
  service: SdkworkBrowserService;
  setGroupId(groupId: string): void;
  setSafeMode(safeMode: SdkworkBrowserSafeMode | "all"): void;
  setSearchQuery(query: string): void;
  setSortBy(sortBy: SdkworkBrowserSortBy): void;
  subscribe(listener: () => void): () => void;
}

export interface CreateSdkworkBrowserControllerOptions {
  initialState?: Partial<SdkworkBrowserControllerState>;
  service?: Partial<SdkworkBrowserService>;
}

function deriveVisibleTabs(
  workspace: SdkworkBrowserWorkspaceData,
  state: Pick<SdkworkBrowserControllerState, "activeGroupId" | "activeSafeMode" | "searchQuery" | "sortBy">,
): SdkworkBrowserTab[] {
  return filterSdkworkBrowserTabs(workspace.tabs, {
    activeGroupId: state.activeGroupId,
    activeSafeMode: state.activeSafeMode,
    query: state.searchQuery,
    sortBy: state.sortBy,
  });
}

function resolveSelectedTabId(
  tabs: readonly SdkworkBrowserTab[],
  selectedTabId: string | null,
): string | null {
  if (selectedTabId && tabs.some((tab) => tab.id === selectedTabId)) {
    return selectedTabId;
  }

  return tabs.find((tab) => tab.active)?.id
    ?? tabs.find((tab) => tab.pinned)?.id
    ?? tabs[0]?.id
    ?? null;
}

function normalizeState(
  state: SdkworkBrowserControllerState,
): SdkworkBrowserControllerState {
  const visibleTabs = deriveVisibleTabs(state.workspace, state);
  const selectedTabId = resolveSelectedTabId(visibleTabs, state.selectedTabId);

  return {
    ...state,
    selectedTab: visibleTabs.find((tab) => tab.id === selectedTabId) ?? null,
    selectedTabId,
    visibleTabs,
  };
}

export function createSdkworkBrowserController(
  options: CreateSdkworkBrowserControllerOptions = {},
): SdkworkBrowserController {
  const service: SdkworkBrowserService = options.service
    ? {
        ...createSdkworkBrowserService(),
        ...options.service,
      }
    : createSdkworkBrowserService();

  const fallbackWorkspace = service.getEmptyWorkspace();
  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeGroupId: "all",
    activeSafeMode: "all",
    isBootstrapped: false,
    isLoading: false,
    searchQuery: "",
    selectedTab: null,
    selectedTabId: null,
    sortBy: "activity",
    visibleTabs: fallbackWorkspace.tabs,
    workspace: fallbackWorkspace,
    ...options.initialState,
  });

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkBrowserControllerState>
      | ((currentState: SdkworkBrowserControllerState) => Partial<SdkworkBrowserControllerState>),
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
          selectedTabId: state.selectedTabId,
          workspace,
        });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : "Failed to load browser workspace.",
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
        selectedTabId: state.selectedTabId,
        workspace,
      });
      return state;
    },

    selectTab(tabId) {
      setState({
        selectedTabId: tabId,
      });
    },

    service,

    setGroupId(groupId) {
      setState({
        activeGroupId: groupId,
      });
    },

    setSafeMode(safeMode) {
      setState({
        activeSafeMode: safeMode,
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

export function useSdkworkBrowserController(
  controller?: SdkworkBrowserController,
  service?: Partial<SdkworkBrowserService>,
): SdkworkBrowserController {
  return useMemo(
    () => controller ?? createSdkworkBrowserController(service ? { service } : undefined),
    [controller, service],
  );
}

export function useSdkworkBrowserControllerState(
  controller: SdkworkBrowserController,
): SdkworkBrowserControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

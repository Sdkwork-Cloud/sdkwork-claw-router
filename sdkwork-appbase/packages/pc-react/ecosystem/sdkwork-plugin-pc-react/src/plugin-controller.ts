import {
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  filterSdkworkPlugins,
  type SdkworkPlugin,
  type SdkworkPluginInstallState,
  type SdkworkPluginRegistryData,
  type SdkworkPluginRiskLevel,
  type SdkworkPluginSortBy,
  type SdkworkPluginSourceKind,
} from "./plugin";
import {
  createSdkworkPluginService,
  type SdkworkPluginService,
} from "./plugin-service";

export type SdkworkPluginSourceFilter = SdkworkPluginSourceKind | "all";
export type SdkworkPluginInstallStateFilter = SdkworkPluginInstallState | "all";
export type SdkworkPluginRiskFilter = SdkworkPluginRiskLevel | "all";

export interface SdkworkPluginControllerState {
  activeInstallState: SdkworkPluginInstallStateFilter;
  activeRiskLevel: SdkworkPluginRiskFilter;
  activeSourceKind: SdkworkPluginSourceFilter;
  catalog: SdkworkPluginRegistryData;
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  searchQuery: string;
  selectedPlugin: SdkworkPlugin | null;
  selectedPluginId: string | null;
  sortBy: SdkworkPluginSortBy;
  visiblePlugins: SdkworkPlugin[];
}

export interface SdkworkPluginController {
  bootstrap(): Promise<SdkworkPluginControllerState>;
  getState(): SdkworkPluginControllerState;
  refresh(): Promise<SdkworkPluginControllerState>;
  selectPlugin(pluginId: string | null): void;
  service: SdkworkPluginService;
  setInstallState(installState: SdkworkPluginInstallStateFilter): void;
  setRiskLevel(riskLevel: SdkworkPluginRiskFilter): void;
  setSearchQuery(query: string): void;
  setSortBy(sortBy: SdkworkPluginSortBy): void;
  setSourceKind(sourceKind: SdkworkPluginSourceFilter): void;
  subscribe(listener: () => void): () => void;
}

export interface CreateSdkworkPluginControllerOptions {
  initialState?: Partial<SdkworkPluginControllerState>;
  service?: Partial<SdkworkPluginService>;
}

function deriveVisiblePlugins(
  catalog: SdkworkPluginRegistryData,
  state: Pick<
    SdkworkPluginControllerState,
    "activeInstallState" | "activeRiskLevel" | "activeSourceKind" | "searchQuery" | "sortBy"
  >,
): SdkworkPlugin[] {
  return filterSdkworkPlugins(catalog.plugins, {
    activeInstallState: state.activeInstallState,
    activeRiskLevel: state.activeRiskLevel,
    activeSourceKind: state.activeSourceKind,
    query: state.searchQuery,
    sortBy: state.sortBy,
  });
}

function resolveSelectedPluginId(
  plugins: readonly SdkworkPlugin[],
  selectedPluginId: string | null,
): string | null {
  if (selectedPluginId && plugins.some((plugin) => plugin.id === selectedPluginId)) {
    return selectedPluginId;
  }

  return plugins.find((plugin) => plugin.installState === "update-available")?.id
    ?? plugins.find((plugin) => plugin.installState === "installed")?.id
    ?? plugins[0]?.id
    ?? null;
}

function normalizeState(
  state: SdkworkPluginControllerState,
): SdkworkPluginControllerState {
  const visiblePlugins = deriveVisiblePlugins(state.catalog, state);
  const selectedPluginId = resolveSelectedPluginId(visiblePlugins, state.selectedPluginId);

  return {
    ...state,
    selectedPlugin: visiblePlugins.find((plugin) => plugin.id === selectedPluginId) ?? null,
    selectedPluginId,
    visiblePlugins,
  };
}

export function createSdkworkPluginController(
  options: CreateSdkworkPluginControllerOptions = {},
): SdkworkPluginController {
  const service: SdkworkPluginService = options.service
    ? {
        ...createSdkworkPluginService(),
        ...options.service,
      }
    : createSdkworkPluginService();
  const fallbackRegistry = service.getEmptyRegistry();
  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeInstallState: "all",
    activeRiskLevel: "all",
    activeSourceKind: "all",
    catalog: fallbackRegistry,
    isBootstrapped: false,
    isLoading: false,
    searchQuery: "",
    selectedPlugin: null,
    selectedPluginId: null,
    sortBy: "readiness",
    visiblePlugins: fallbackRegistry.plugins,
    ...options.initialState,
  });

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkPluginControllerState>
      | ((currentState: SdkworkPluginControllerState) => Partial<SdkworkPluginControllerState>),
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
        const catalog = await service.getRegistry();
        setState({
          catalog,
          isBootstrapped: true,
          isLoading: false,
          selectedPluginId: state.selectedPluginId,
        });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : "Failed to load plugin center.",
        });
        throw error;
      }
    },

    getState() {
      return state;
    },

    async refresh() {
      const catalog = await service.getRegistry();
      setState({
        catalog,
        isBootstrapped: true,
        isLoading: false,
        selectedPluginId: state.selectedPluginId,
      });
      return state;
    },

    selectPlugin(pluginId) {
      setState({
        selectedPluginId: pluginId,
      });
    },

    service,

    setInstallState(installState) {
      setState({
        activeInstallState: installState,
      });
    },

    setRiskLevel(riskLevel) {
      setState({
        activeRiskLevel: riskLevel,
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

    setSourceKind(sourceKind) {
      setState({
        activeSourceKind: sourceKind,
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

export function useSdkworkPluginController(
  controller?: SdkworkPluginController,
  service?: Partial<SdkworkPluginService>,
): SdkworkPluginController {
  return useMemo(
    () => controller ?? createSdkworkPluginController(service ? { service } : undefined),
    [controller, service],
  );
}

export function useSdkworkPluginControllerState(
  controller: SdkworkPluginController,
): SdkworkPluginControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

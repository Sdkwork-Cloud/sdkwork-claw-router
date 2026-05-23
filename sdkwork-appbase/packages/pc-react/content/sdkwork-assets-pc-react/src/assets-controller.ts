import {
  useMemo,
  useSyncExternalStore,
} from "react";
import type {
  SdkworkAsset,
  SdkworkAssetReadiness,
  SdkworkAssetsWorkspaceData,
} from "./assets";
import {
  createSdkworkAssetsService,
  type SdkworkAssetsService,
} from "./assets-service";

export interface SdkworkAssetsControllerState {
  activeCollection: string | "all";
  activeReadiness: SdkworkAssetReadiness | "all";
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  searchQuery: string;
  visibleAssets: SdkworkAsset[];
  workspace: SdkworkAssetsWorkspaceData;
}

export interface SdkworkAssetsController {
  bootstrap(): Promise<SdkworkAssetsControllerState>;
  getState(): SdkworkAssetsControllerState;
  refresh(): Promise<SdkworkAssetsControllerState>;
  setCollection(collectionId: string | "all"): void;
  setReadiness(readiness: SdkworkAssetReadiness | "all"): void;
  setSearchQuery(query: string): void;
  subscribe(listener: () => void): () => void;
}

export interface CreateSdkworkAssetsControllerOptions {
  service?: Partial<SdkworkAssetsService>;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function deriveVisibleAssets(
  workspace: SdkworkAssetsWorkspaceData,
  activeCollection: string | "all",
  activeReadiness: SdkworkAssetReadiness | "all",
  searchQuery: string,
): SdkworkAsset[] {
  const query = normalizeText(searchQuery);

  return workspace.assets.filter((asset) => {
    if (activeCollection !== "all" && asset.collectionId !== activeCollection) {
      return false;
    }
    if (activeReadiness !== "all" && asset.readiness !== activeReadiness) {
      return false;
    }
    if (!query) {
      return true;
    }

    return [asset.id, asset.title, asset.format, ...asset.tags].some((value) => normalizeText(value).includes(query));
  });
}

function normalizeState(state: SdkworkAssetsControllerState): SdkworkAssetsControllerState {
  return {
    ...state,
    visibleAssets: deriveVisibleAssets(
      state.workspace,
      state.activeCollection,
      state.activeReadiness,
      state.searchQuery,
    ),
  };
}

export function createSdkworkAssetsController(
  options: CreateSdkworkAssetsControllerOptions = {},
) {
  const service: SdkworkAssetsService = options.service
    ? {
        ...createSdkworkAssetsService(),
        ...options.service,
      }
    : createSdkworkAssetsService();

  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeCollection: "all",
    activeReadiness: "all",
    isBootstrapped: false,
    isLoading: false,
    searchQuery: "",
    visibleAssets: [],
    workspace: service.getEmptyWorkspace(),
  });

  function emit() {
    listeners.forEach((listener) => listener());
  }

  function setState(next: Partial<SdkworkAssetsControllerState>) {
    state = normalizeState({
      ...state,
      ...next,
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
          lastError: error instanceof Error ? error.message : "Failed to load assets workspace.",
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

    setCollection(collectionId: string | "all") {
      setState({
        activeCollection: collectionId,
      });
    },

    setReadiness(readiness: SdkworkAssetReadiness | "all") {
      setState({
        activeReadiness: readiness,
      });
    },

    setSearchQuery(query: string) {
      setState({
        searchQuery: query,
      });
    },

    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useSdkworkAssetsController(
  controller?: ReturnType<typeof createSdkworkAssetsController>,
  service?: Partial<SdkworkAssetsService>,
) {
  return useMemo(
    () => controller ?? createSdkworkAssetsController(service ? { service } : undefined),
    [controller, service],
  );
}

export function useSdkworkAssetsControllerState(
  controller: ReturnType<typeof createSdkworkAssetsController>,
): SdkworkAssetsControllerState {
  return useSyncExternalStore(controller.subscribe, controller.getState, controller.getState);
}

import {
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  createSdkworkMarketService,
  type SdkworkMarketService,
} from "./market-service";
import {
  filterSdkworkMarketItems,
  type SdkworkMarketCatalogData,
  type SdkworkMarketItem,
  type SdkworkMarketItemKind,
  type SdkworkMarketSortBy,
  type SdkworkMarketSourceKind,
} from "./market";

export interface SdkworkMarketControllerState {
  activeCategoryId: string;
  activeKind: SdkworkMarketItemKind | "all";
  activeSourceKind: SdkworkMarketSourceKind | "all";
  catalog: SdkworkMarketCatalogData;
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  searchQuery: string;
  selectedItem: SdkworkMarketItem | null;
  selectedItemId: string | null;
  sortBy: SdkworkMarketSortBy;
  visibleItems: SdkworkMarketItem[];
}

export interface SdkworkMarketController {
  bootstrap(): Promise<SdkworkMarketControllerState>;
  getState(): SdkworkMarketControllerState;
  refresh(): Promise<SdkworkMarketControllerState>;
  selectItem(itemId: string | null): void;
  service: SdkworkMarketService;
  setCategoryId(categoryId: string): void;
  setKind(kind: SdkworkMarketItemKind | "all"): void;
  setSearchQuery(query: string): void;
  setSortBy(sortBy: SdkworkMarketSortBy): void;
  setSourceKind(sourceKind: SdkworkMarketSourceKind | "all"): void;
  subscribe(listener: () => void): () => void;
}

export interface CreateSdkworkMarketControllerOptions {
  initialState?: Partial<SdkworkMarketControllerState>;
  service?: Partial<SdkworkMarketService>;
}

function resolveSelectedItemId(
  items: readonly SdkworkMarketItem[],
  selectedItemId: string | null,
): string | null {
  if (selectedItemId && items.some((item) => item.id === selectedItemId)) {
    return selectedItemId;
  }

  return items.find((item) => item.recommended)?.id
    ?? items.find((item) => item.featured)?.id
    ?? items[0]?.id
    ?? null;
}

function normalizeState(
  state: SdkworkMarketControllerState,
): SdkworkMarketControllerState {
  const visibleItems = filterSdkworkMarketItems(state.catalog.items, {
    activeCategoryId: state.activeCategoryId,
    activeKind: state.activeKind,
    activeSourceKind: state.activeSourceKind,
    query: state.searchQuery,
    sortBy: state.sortBy,
  });
  const selectedItemId = resolveSelectedItemId(visibleItems, state.selectedItemId);

  return {
    ...state,
    selectedItem: visibleItems.find((item) => item.id === selectedItemId) ?? null,
    selectedItemId,
    visibleItems,
  };
}

export function createSdkworkMarketController(
  options: CreateSdkworkMarketControllerOptions = {},
): SdkworkMarketController {
  const service: SdkworkMarketService = options.service
    ? {
        ...createSdkworkMarketService(),
        ...options.service,
      }
    : createSdkworkMarketService();
  const fallbackCatalog = service.getEmptyCatalog();
  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeCategoryId: "all",
    activeKind: "all",
    activeSourceKind: "all",
    catalog: fallbackCatalog,
    isBootstrapped: false,
    isLoading: false,
    searchQuery: "",
    selectedItem: null,
    selectedItemId: null,
    sortBy: "recommended",
    visibleItems: fallbackCatalog.items,
    ...options.initialState,
  });

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkMarketControllerState>
      | ((currentState: SdkworkMarketControllerState) => Partial<SdkworkMarketControllerState>),
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
        const catalog = await service.getCatalog();
        setState({
          catalog,
          isBootstrapped: true,
          isLoading: false,
        });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : "Failed to load marketplace.",
        });
        throw error;
      }
    },

    getState() {
      return state;
    },

    async refresh() {
      const catalog = await service.getCatalog();
      setState({
        catalog,
        isBootstrapped: true,
        isLoading: false,
      });
      return state;
    },

    selectItem(itemId) {
      setState({
        selectedItemId: itemId,
      });
    },

    service,

    setCategoryId(categoryId) {
      setState({
        activeCategoryId: categoryId,
      });
    },

    setKind(kind) {
      setState({
        activeKind: kind,
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

export function useSdkworkMarketController(
  controller?: SdkworkMarketController,
  service?: Partial<SdkworkMarketService>,
): SdkworkMarketController {
  return useMemo(
    () => controller ?? createSdkworkMarketController(service ? { service } : undefined),
    [controller, service],
  );
}

export function useSdkworkMarketControllerState(
  controller: SdkworkMarketController,
): SdkworkMarketControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

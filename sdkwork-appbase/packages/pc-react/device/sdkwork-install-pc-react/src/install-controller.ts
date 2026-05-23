import {
  useMemo,
  useSyncExternalStore,
} from "react";
import type {
  SdkworkInstallCatalogData,
  SdkworkInstallTargetKind,
  SdkworkInstallVariant,
} from "./install";
import {
  createSdkworkInstallService,
  type GetSdkworkInstallCatalogInput,
  type SdkworkInstallService,
} from "./install-service";

export type SdkworkInstallTargetKindFilter = SdkworkInstallTargetKind | "all";

export interface SdkworkInstallControllerState {
  activeTargetKind: SdkworkInstallTargetKindFilter;
  catalog: SdkworkInstallCatalogData;
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  selectedVariant: SdkworkInstallVariant | null;
  selectedVariantId: string | null;
  visibleVariants: SdkworkInstallVariant[];
}

export interface SdkworkInstallController {
  bootstrap(input?: GetSdkworkInstallCatalogInput): Promise<SdkworkInstallControllerState>;
  getState(): SdkworkInstallControllerState;
  refresh(input?: GetSdkworkInstallCatalogInput): Promise<SdkworkInstallControllerState>;
  selectVariant(variantId: string | null): void;
  service: SdkworkInstallService;
  setTargetKind(targetKind: SdkworkInstallTargetKindFilter): void;
  subscribe(listener: () => void): () => void;
}

export interface CreateSdkworkInstallControllerOptions {
  initialState?: Partial<SdkworkInstallControllerState>;
  service?: Partial<SdkworkInstallService>;
}

function deriveVisibleVariants(
  catalog: SdkworkInstallCatalogData,
  activeTargetKind: SdkworkInstallTargetKindFilter,
): SdkworkInstallVariant[] {
  if (activeTargetKind === "all") {
    return catalog.variants;
  }

  return catalog.variants.filter((variant) => variant.targetKind === activeTargetKind);
}

function resolveSelectedVariantId(
  variants: readonly SdkworkInstallVariant[],
  selectedVariantId: string | null,
): string | null {
  if (selectedVariantId && variants.some((variant) => variant.id === selectedVariantId)) {
    return selectedVariantId;
  }

  return variants.find((variant) => variant.recommended)?.id ?? variants[0]?.id ?? null;
}

function normalizeState(
  state: SdkworkInstallControllerState,
): SdkworkInstallControllerState {
  const visibleVariants = deriveVisibleVariants(state.catalog, state.activeTargetKind);
  const selectedVariantId = resolveSelectedVariantId(visibleVariants, state.selectedVariantId);

  return {
    ...state,
    selectedVariant: visibleVariants.find((variant) => variant.id === selectedVariantId) ?? null,
    selectedVariantId,
    visibleVariants,
  };
}

export function createSdkworkInstallController(
  options: CreateSdkworkInstallControllerOptions = {},
): SdkworkInstallController {
  const service: SdkworkInstallService = options.service
    ? {
        ...createSdkworkInstallService(),
        ...options.service,
      }
    : createSdkworkInstallService();
  const fallbackCatalog = service.getEmptyCatalog();
  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeTargetKind: "all",
    catalog: fallbackCatalog,
    isBootstrapped: false,
    isLoading: false,
    selectedVariant: null,
    selectedVariantId: fallbackCatalog.selectedVariantId,
    visibleVariants: fallbackCatalog.variants,
    ...options.initialState,
  });

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkInstallControllerState>
      | ((currentState: SdkworkInstallControllerState) => Partial<SdkworkInstallControllerState>),
  ): void {
    const partial = typeof next === "function" ? next(state) : next;
    state = normalizeState({
      ...state,
      ...partial,
    });
    emit();
  }

  return {
    async bootstrap(input) {
      setState({
        isLoading: true,
        lastError: undefined,
      });

      try {
        const catalog = await service.getCatalog(input);
        setState({
          catalog,
          isBootstrapped: true,
          isLoading: false,
          selectedVariantId: catalog.selectedVariantId,
        });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : "Failed to load install center.",
        });
        throw error;
      }
    },

    getState() {
      return state;
    },

    async refresh(input) {
      const targetKind = state.activeTargetKind === "all" ? undefined : state.activeTargetKind;
      const catalog = await service.getCatalog({
        ...input,
        targetKind,
        variantId: state.selectedVariantId,
      });

      setState({
        catalog,
        isBootstrapped: true,
        isLoading: false,
        selectedVariantId: state.selectedVariantId,
      });
      return state;
    },

    selectVariant(variantId) {
      setState({
        selectedVariantId: variantId,
      });
    },

    service,

    setTargetKind(targetKind) {
      setState((currentState) => ({
        activeTargetKind: targetKind,
        selectedVariantId:
          targetKind === "all"
            ? currentState.selectedVariantId
            : currentState.catalog.variants.find((variant) => variant.targetKind === targetKind)?.id ?? null,
      }));
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export function useSdkworkInstallController(
  controller?: SdkworkInstallController,
  service?: Partial<SdkworkInstallService>,
): SdkworkInstallController {
  return useMemo(
    () => controller ?? createSdkworkInstallController(service ? { service } : undefined),
    [controller, service],
  );
}

export function useSdkworkInstallControllerState(
  controller: SdkworkInstallController,
): SdkworkInstallControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

import {
  useMemo,
  useSyncExternalStore,
} from "react";
import type {
  SdkworkDistributionCatalogData,
  SdkworkDistributionChannel,
  SdkworkDistributionChannelType,
} from "./distribution";
import {
  createSdkworkDistributionService,
  type GetSdkworkDistributionCatalogInput,
  type SdkworkDistributionService,
} from "./distribution-service";

export type SdkworkDistributionChannelTypeFilter = SdkworkDistributionChannelType | "all";

export interface SdkworkDistributionControllerState {
  activeChannelType: SdkworkDistributionChannelTypeFilter;
  catalog: SdkworkDistributionCatalogData;
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  selectedChannel: SdkworkDistributionChannel | null;
  selectedChannelId: string | null;
  visibleChannels: SdkworkDistributionChannel[];
}

export interface SdkworkDistributionController {
  bootstrap(input?: GetSdkworkDistributionCatalogInput): Promise<SdkworkDistributionControllerState>;
  getState(): SdkworkDistributionControllerState;
  refresh(input?: GetSdkworkDistributionCatalogInput): Promise<SdkworkDistributionControllerState>;
  selectChannel(channelId: string | null): void;
  service: SdkworkDistributionService;
  setChannelType(channelType: SdkworkDistributionChannelTypeFilter): void;
  subscribe(listener: () => void): () => void;
}

export interface CreateSdkworkDistributionControllerOptions {
  initialState?: Partial<SdkworkDistributionControllerState>;
  service?: Partial<SdkworkDistributionService>;
}

function deriveVisibleChannels(
  catalog: SdkworkDistributionCatalogData,
  activeChannelType: SdkworkDistributionChannelTypeFilter,
): SdkworkDistributionChannel[] {
  if (activeChannelType === "all") {
    return catalog.channels;
  }

  return catalog.channels.filter((channel) => channel.type === activeChannelType);
}

function resolveSelectedChannelId(
  channels: readonly SdkworkDistributionChannel[],
  selectedChannelId: string | null,
): string | null {
  if (selectedChannelId && channels.some((channel) => channel.id === selectedChannelId)) {
    return selectedChannelId;
  }

  return channels[0]?.id ?? null;
}

function normalizeState(
  state: SdkworkDistributionControllerState,
): SdkworkDistributionControllerState {
  const visibleChannels = deriveVisibleChannels(state.catalog, state.activeChannelType);
  const selectedChannelId = resolveSelectedChannelId(visibleChannels, state.selectedChannelId);

  return {
    ...state,
    selectedChannel: visibleChannels.find((channel) => channel.id === selectedChannelId) ?? null,
    selectedChannelId,
    visibleChannels,
  };
}

export function createSdkworkDistributionController(
  options: CreateSdkworkDistributionControllerOptions = {},
): SdkworkDistributionController {
  const service: SdkworkDistributionService = options.service
    ? {
        ...createSdkworkDistributionService(),
        ...options.service,
      }
    : createSdkworkDistributionService();
  const fallbackCatalog = service.getEmptyCatalog();
  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeChannelType: "all",
    catalog: fallbackCatalog,
    isBootstrapped: false,
    isLoading: false,
    selectedChannel: null,
    selectedChannelId: fallbackCatalog.selectedChannelId,
    visibleChannels: fallbackCatalog.channels,
    ...options.initialState,
  });

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkDistributionControllerState>
      | ((currentState: SdkworkDistributionControllerState) => Partial<SdkworkDistributionControllerState>),
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
          selectedChannelId: catalog.selectedChannelId,
        });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : "Failed to load distribution center.",
        });
        throw error;
      }
    },

    getState() {
      return state;
    },

    async refresh(input) {
      const channelType = state.activeChannelType === "all" ? undefined : state.activeChannelType;
      const catalog = await service.getCatalog({
        ...input,
        channelId: state.selectedChannelId,
        channelType,
      });
      setState({
        catalog,
        isBootstrapped: true,
        isLoading: false,
      });
      return state;
    },

    selectChannel(channelId) {
      setState({
        selectedChannelId: channelId,
      });
    },

    service,

    setChannelType(channelType) {
      setState((currentState) => ({
        activeChannelType: channelType,
        selectedChannelId: channelType === "all"
          ? currentState.selectedChannelId
          : currentState.catalog.channels.find((channel) => channel.type === channelType)?.id ?? null,
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

export function useSdkworkDistributionController(
  controller?: SdkworkDistributionController,
  service?: Partial<SdkworkDistributionService>,
): SdkworkDistributionController {
  return useMemo(
    () => controller ?? createSdkworkDistributionController(service ? { service } : undefined),
    [controller, service],
  );
}

export function useSdkworkDistributionControllerState(
  controller: SdkworkDistributionController,
): SdkworkDistributionControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

import {
  useMemo,
  useSyncExternalStore,
} from "react";
import type { SdkworkMediaItem, SdkworkMediaPublishPosture, SdkworkMediaWorkspaceData } from "./media";
import {
  createSdkworkMediaMessages,
  type SdkworkMediaMessagesOverrides,
} from "./media-copy";
import { createSdkworkMediaService, type SdkworkMediaService } from "./media-service";

export interface SdkworkMediaControllerState {
  activePublishPosture: SdkworkMediaPublishPosture | "all";
  activeQueue: string | "all";
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  searchQuery: string;
  visibleItems: SdkworkMediaItem[];
  workspace: SdkworkMediaWorkspaceData;
}

export interface CreateSdkworkMediaControllerOptions {
  locale?: string | null;
  messages?: SdkworkMediaMessagesOverrides;
  service?: Partial<SdkworkMediaService>;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function deriveVisibleItems(
  workspace: SdkworkMediaWorkspaceData,
  activeQueue: string | "all",
  activePublishPosture: SdkworkMediaPublishPosture | "all",
  searchQuery: string,
) {
  const query = normalizeText(searchQuery);

  return workspace.items.filter((item) => {
    if (activeQueue !== "all" && item.queueId !== activeQueue) {
      return false;
    }
    if (activePublishPosture !== "all" && item.publishPosture !== activePublishPosture) {
      return false;
    }
    if (!query) {
      return true;
    }

    return [item.id, item.title, item.kind].some((value) => normalizeText(value).includes(query));
  });
}

function normalizeState(state: SdkworkMediaControllerState): SdkworkMediaControllerState {
  return {
    ...state,
    visibleItems: deriveVisibleItems(
      state.workspace,
      state.activeQueue,
      state.activePublishPosture,
      state.searchQuery,
    ),
  };
}

export function createSdkworkMediaController(options: CreateSdkworkMediaControllerOptions = {}) {
  const copy = createSdkworkMediaMessages(options.locale, options.messages);
  const service: SdkworkMediaService = options.service
    ? {
        ...createSdkworkMediaService(),
        ...options.service,
      }
    : createSdkworkMediaService();

  const listeners = new Set<() => void>();
  let state = normalizeState({
    activePublishPosture: "all",
    activeQueue: "all",
    isBootstrapped: false,
    isLoading: false,
    searchQuery: "",
    visibleItems: [],
    workspace: service.getEmptyWorkspace(),
  });

  function emit() {
    listeners.forEach((listener) => listener());
  }

  function setState(next: Partial<SdkworkMediaControllerState>) {
    state = normalizeState({
      ...state,
      ...next,
    });
    emit();
  }

  return {
    async bootstrap() {
      setState({ isLoading: true, lastError: undefined });
      try {
        const workspace = await service.getWorkspace();
        setState({ isBootstrapped: true, isLoading: false, workspace });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : copy.service.loadWorkspaceFailed,
        });
        throw error;
      }
    },

    getState() {
      return state;
    },

    async refresh() {
      setState({ isLoading: true, lastError: undefined });
      try {
        const workspace = await service.getWorkspace();
        setState({ isBootstrapped: true, isLoading: false, workspace });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : copy.service.loadWorkspaceFailed,
        });
        throw error;
      }
    },

    setPublishPosture(publishPosture: SdkworkMediaPublishPosture | "all") {
      setState({ activePublishPosture: publishPosture });
    },

    setQueue(queueId: string | "all") {
      setState({ activeQueue: queueId });
    },

    setSearchQuery(query: string) {
      setState({ searchQuery: query });
    },

    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useSdkworkMediaController(
  controller?: ReturnType<typeof createSdkworkMediaController>,
  options?: Pick<CreateSdkworkMediaControllerOptions, "locale" | "messages" | "service">,
) {
  const locale = options?.locale;
  const messages = options?.messages;
  const service = options?.service;

  return useMemo(
    () => controller ?? createSdkworkMediaController({
      ...(locale ? { locale } : {}),
      ...(messages ? { messages } : {}),
      ...(service ? { service } : {}),
    }),
    [controller, locale, messages, service],
  );
}

export function useSdkworkMediaControllerState(
  controller: ReturnType<typeof createSdkworkMediaController>,
): SdkworkMediaControllerState {
  return useSyncExternalStore(controller.subscribe, controller.getState, controller.getState);
}

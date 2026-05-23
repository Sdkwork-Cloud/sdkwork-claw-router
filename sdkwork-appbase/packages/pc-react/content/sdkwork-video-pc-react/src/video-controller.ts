import {
  useMemo,
  useSyncExternalStore,
} from "react";
import type { SdkworkVideoAsset, SdkworkVideoJobStatus, SdkworkVideoWorkspaceData } from "./video";
import {
  createSdkworkVideoMessages,
  type SdkworkVideoMessagesOverrides,
} from "./video-copy";
import { createSdkworkVideoService, type SdkworkVideoService } from "./video-service";

export interface SdkworkVideoControllerState {
  activePreset: string | "all";
  activeStatus: SdkworkVideoJobStatus | "all";
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  searchQuery: string;
  visibleVideos: SdkworkVideoAsset[];
  workspace: SdkworkVideoWorkspaceData;
}

export interface CreateSdkworkVideoControllerOptions {
  locale?: string | null;
  messages?: SdkworkVideoMessagesOverrides;
  service?: Partial<SdkworkVideoService>;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function deriveVisibleVideos(
  workspace: SdkworkVideoWorkspaceData,
  activePreset: string | "all",
  activeStatus: SdkworkVideoJobStatus | "all",
  searchQuery: string,
) {
  const query = normalizeText(searchQuery);

  return workspace.videos.filter((video) => {
    if (activePreset !== "all" && video.presetId !== activePreset) {
      return false;
    }
    if (activeStatus !== "all" && video.status !== activeStatus) {
      return false;
    }
    if (!query) {
      return true;
    }

    return [video.id, video.title, video.resolution].some((value) => normalizeText(value).includes(query));
  });
}

function normalizeState(state: SdkworkVideoControllerState): SdkworkVideoControllerState {
  return {
    ...state,
    visibleVideos: deriveVisibleVideos(
      state.workspace,
      state.activePreset,
      state.activeStatus,
      state.searchQuery,
    ),
  };
}

export function createSdkworkVideoController(options: CreateSdkworkVideoControllerOptions = {}) {
  const copy = createSdkworkVideoMessages(options.locale, options.messages);
  const service: SdkworkVideoService = options.service
    ? {
        ...createSdkworkVideoService(),
        ...options.service,
      }
    : createSdkworkVideoService();

  const listeners = new Set<() => void>();
  let state = normalizeState({
    activePreset: "all",
    activeStatus: "all",
    isBootstrapped: false,
    isLoading: false,
    searchQuery: "",
    visibleVideos: [],
    workspace: service.getEmptyWorkspace(),
  });

  function emit() {
    listeners.forEach((listener) => listener());
  }

  function setState(next: Partial<SdkworkVideoControllerState>) {
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

    setPreset(presetId: string | "all") {
      setState({ activePreset: presetId });
    },

    setSearchQuery(query: string) {
      setState({ searchQuery: query });
    },

    setStatus(status: SdkworkVideoJobStatus | "all") {
      setState({ activeStatus: status });
    },

    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useSdkworkVideoController(
  controller?: ReturnType<typeof createSdkworkVideoController>,
  options?: Pick<CreateSdkworkVideoControllerOptions, "locale" | "messages" | "service">,
) {
  const locale = options?.locale;
  const messages = options?.messages;
  const service = options?.service;

  return useMemo(
    () => controller ?? createSdkworkVideoController({
      ...(locale ? { locale } : {}),
      ...(messages ? { messages } : {}),
      ...(service ? { service } : {}),
    }),
    [controller, locale, messages, service],
  );
}

export function useSdkworkVideoControllerState(
  controller: ReturnType<typeof createSdkworkVideoController>,
): SdkworkVideoControllerState {
  return useSyncExternalStore(controller.subscribe, controller.getState, controller.getState);
}

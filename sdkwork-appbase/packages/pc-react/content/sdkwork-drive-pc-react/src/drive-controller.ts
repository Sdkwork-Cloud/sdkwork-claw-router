import {
  useMemo,
  useSyncExternalStore,
} from "react";
import type { SdkworkDriveEntry, SdkworkDriveSyncPosture, SdkworkDriveWorkspaceData } from "./drive";
import { createSdkworkDriveService, type SdkworkDriveService } from "./drive-service";

export interface SdkworkDriveControllerState {
  activeLocation: string | "all";
  activeSyncPosture: SdkworkDriveSyncPosture | "all";
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  searchQuery: string;
  visibleEntries: SdkworkDriveEntry[];
  workspace: SdkworkDriveWorkspaceData;
}

export interface CreateSdkworkDriveControllerOptions {
  service?: Partial<SdkworkDriveService>;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function deriveVisibleEntries(
  workspace: SdkworkDriveWorkspaceData,
  activeLocation: string | "all",
  activeSyncPosture: SdkworkDriveSyncPosture | "all",
  searchQuery: string,
) {
  const query = normalizeText(searchQuery);

  return workspace.entries.filter((entry) => {
    if (activeLocation !== "all" && entry.locationId !== activeLocation) {
      return false;
    }
    if (activeSyncPosture !== "all" && entry.syncPosture !== activeSyncPosture) {
      return false;
    }
    if (!query) {
      return true;
    }

    return [entry.id, entry.title, entry.kind].some((value) => normalizeText(value).includes(query));
  });
}

function normalizeState(state: SdkworkDriveControllerState): SdkworkDriveControllerState {
  return {
    ...state,
    visibleEntries: deriveVisibleEntries(
      state.workspace,
      state.activeLocation,
      state.activeSyncPosture,
      state.searchQuery,
    ),
  };
}

export function createSdkworkDriveController(options: CreateSdkworkDriveControllerOptions = {}) {
  const service: SdkworkDriveService = options.service
    ? {
        ...createSdkworkDriveService(),
        ...options.service,
      }
    : createSdkworkDriveService();

  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeLocation: "all",
    activeSyncPosture: "all",
    isBootstrapped: false,
    isLoading: false,
    searchQuery: "",
    visibleEntries: [],
    workspace: service.getEmptyWorkspace(),
  });

  function emit() {
    listeners.forEach((listener) => listener());
  }

  function setState(next: Partial<SdkworkDriveControllerState>) {
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
          lastError: error instanceof Error ? error.message : "Failed to load drive workspace.",
        });
        throw error;
      }
    },

    getState() {
      return state;
    },

    async refresh() {
      const workspace = await service.getWorkspace();
      setState({ isBootstrapped: true, isLoading: false, workspace });
      return state;
    },

    setLocation(locationId: string | "all") {
      setState({ activeLocation: locationId });
    },

    setSearchQuery(query: string) {
      setState({ searchQuery: query });
    },

    setSyncPosture(syncPosture: SdkworkDriveSyncPosture | "all") {
      setState({ activeSyncPosture: syncPosture });
    },

    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useSdkworkDriveController(
  controller?: ReturnType<typeof createSdkworkDriveController>,
  service?: Partial<SdkworkDriveService>,
) {
  return useMemo(() => controller ?? createSdkworkDriveController(service ? { service } : undefined), [controller, service]);
}

export function useSdkworkDriveControllerState(
  controller: ReturnType<typeof createSdkworkDriveController>,
): SdkworkDriveControllerState {
  return useSyncExternalStore(controller.subscribe, controller.getState, controller.getState);
}

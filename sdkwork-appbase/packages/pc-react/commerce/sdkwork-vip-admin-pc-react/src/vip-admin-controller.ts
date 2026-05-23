import {
  useMemo,
  useSyncExternalStore,
} from "react";
import type { SdkworkVipAdminView } from "./vip-admin";
import {
  createSdkworkVipAdminService,
  type SdkworkVipAdminDashboardData,
  type SdkworkVipAdminLevel,
  type SdkworkVipAdminLevelDeleteResult,
  type SdkworkVipAdminLevelUpdateInput,
  type SdkworkVipAdminMembership,
  type SdkworkVipAdminMembershipUpdateInput,
  type SdkworkVipAdminPackage,
  type SdkworkVipAdminPackageDeleteResult,
  type SdkworkVipAdminPackageGroup,
  type SdkworkVipAdminPackageGroupDeleteResult,
  type SdkworkVipAdminPackageGroupMutationInput,
  type SdkworkVipAdminPackageUpdateInput,
  type SdkworkVipAdminService,
} from "./vip-admin-service";

export interface SdkworkVipAdminControllerState {
  activeView: SdkworkVipAdminView;
  dashboard: SdkworkVipAdminDashboardData;
  isBootstrapped: boolean;
  isLoading: boolean;
  isMutating: boolean;
  lastError?: string;
}

export interface SdkworkVipAdminController {
  assignPackagesToGroup(packages: SdkworkVipAdminPackage[], packageGroupId: string): Promise<SdkworkVipAdminControllerState>;
  bootstrap(): Promise<SdkworkVipAdminControllerState>;
  createLevel(input: SdkworkVipAdminLevelUpdateInput): Promise<SdkworkVipAdminControllerState>;
  createPackage(input: SdkworkVipAdminPackageUpdateInput): Promise<SdkworkVipAdminControllerState>;
  createPackageGroup(input: SdkworkVipAdminPackageGroupMutationInput): Promise<SdkworkVipAdminControllerState>;
  deleteLevel(levelId: string): Promise<SdkworkVipAdminControllerState>;
  deletePackage(packageId: string): Promise<SdkworkVipAdminControllerState>;
  deletePackageGroup(packageGroupId: string): Promise<SdkworkVipAdminControllerState>;
  getState(): SdkworkVipAdminControllerState;
  refresh(): Promise<SdkworkVipAdminControllerState>;
  service: SdkworkVipAdminService;
  setView(view: SdkworkVipAdminView): void;
  subscribe(listener: () => void): () => void;
  updateLevel(levelId: string, input: SdkworkVipAdminLevelUpdateInput): Promise<SdkworkVipAdminControllerState>;
  updateMembershipStatus(
    membershipId: string,
    input: SdkworkVipAdminMembershipUpdateInput,
  ): Promise<SdkworkVipAdminMembership>;
  updatePackage(packageId: string, input: SdkworkVipAdminPackageUpdateInput): Promise<SdkworkVipAdminControllerState>;
  updatePackageGroup(
    packageGroupId: string,
    input: SdkworkVipAdminPackageGroupMutationInput,
  ): Promise<SdkworkVipAdminControllerState>;
}

export interface CreateSdkworkVipAdminControllerOptions {
  initialState?: Partial<SdkworkVipAdminControllerState>;
  service?: Partial<SdkworkVipAdminService>;
}

type MutationResult =
  | SdkworkVipAdminControllerState
  | SdkworkVipAdminLevel
  | SdkworkVipAdminLevelDeleteResult
  | SdkworkVipAdminPackage
  | SdkworkVipAdminPackageDeleteResult
  | SdkworkVipAdminPackageGroup
  | SdkworkVipAdminPackageGroupDeleteResult
  | SdkworkVipAdminMembership
  | SdkworkVipAdminPackage[];

export function createSdkworkVipAdminController(
  options: CreateSdkworkVipAdminControllerOptions = {},
): SdkworkVipAdminController {
  const baseService = createSdkworkVipAdminService();
  const service: SdkworkVipAdminService = options.service
    ? {
        ...baseService,
        ...options.service,
      }
    : baseService;
  const listeners = new Set<() => void>();
  let state: SdkworkVipAdminControllerState = {
    activeView: "levels",
    dashboard: service.getEmptyDashboard(),
    isBootstrapped: false,
    isLoading: false,
    isMutating: false,
    ...options.initialState,
  };

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkVipAdminControllerState>
      | ((currentState: SdkworkVipAdminControllerState) => Partial<SdkworkVipAdminControllerState>),
  ): void {
    const partial = typeof next === "function" ? next(state) : next;
    state = {
      ...state,
      ...partial,
    };
    emit();
  }

  async function loadDashboard(): Promise<SdkworkVipAdminDashboardData> {
    return service.getDashboard();
  }

  async function refreshAfterMutation(): Promise<SdkworkVipAdminControllerState> {
    const dashboard = await loadDashboard();
    setState({
      dashboard,
      isBootstrapped: true,
      isMutating: false,
    });
    return state;
  }

  async function runMutation<T extends MutationResult>(
    operation: () => Promise<T>,
    fallbackMessage: string,
    options: { refresh?: boolean } = { refresh: true },
  ): Promise<T | SdkworkVipAdminControllerState> {
    setState({
      isMutating: true,
      lastError: undefined,
    });

    try {
      const result = await operation();
      if (options.refresh === false) {
        setState({
          isMutating: false,
        });
        return result;
      }
      return refreshAfterMutation();
    } catch (error) {
      setState({
        isMutating: false,
        lastError: error instanceof Error ? error.message : fallbackMessage,
      });
      throw error;
    }
  }

  return {
    async assignPackagesToGroup(packages, packageGroupId) {
      return runMutation(
        () => service.assignPackagesToGroup(packages, packageGroupId),
        "Failed to assign VIP packages.",
      ) as Promise<SdkworkVipAdminControllerState>;
    },

    async bootstrap() {
      setState({
        isLoading: true,
        lastError: undefined,
      });

      try {
        const dashboard = await loadDashboard();
        setState({
          dashboard,
          isBootstrapped: true,
          isLoading: false,
        });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : "Failed to load VIP admin.",
        });
        throw error;
      }
    },

    async createLevel(input) {
      return runMutation(
        () => service.createLevel(input),
        "Failed to create VIP level.",
      ) as Promise<SdkworkVipAdminControllerState>;
    },

    async createPackage(input) {
      return runMutation(
        () => service.createPackage(input),
        "Failed to create VIP package.",
      ) as Promise<SdkworkVipAdminControllerState>;
    },

    async createPackageGroup(input) {
      return runMutation(
        () => service.createPackageGroup(input),
        "Failed to create VIP package group.",
      ) as Promise<SdkworkVipAdminControllerState>;
    },

    async deleteLevel(levelId) {
      return runMutation(
        () => service.deleteLevel(levelId),
        "Failed to delete VIP level.",
      ) as Promise<SdkworkVipAdminControllerState>;
    },

    async deletePackage(packageId) {
      return runMutation(
        () => service.deletePackage(packageId),
        "Failed to delete VIP package.",
      ) as Promise<SdkworkVipAdminControllerState>;
    },

    async deletePackageGroup(packageGroupId) {
      return runMutation(
        () => service.deletePackageGroup(packageGroupId),
        "Failed to delete VIP package group.",
      ) as Promise<SdkworkVipAdminControllerState>;
    },

    getState() {
      return state;
    },

    async refresh() {
      const dashboard = await loadDashboard();
      setState({
        dashboard,
        isBootstrapped: true,
        isLoading: false,
      });
      return state;
    },

    service,

    setView(view) {
      setState({
        activeView: view,
      });
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    async updateLevel(levelId, input) {
      return runMutation(
        () => service.updateLevel(levelId, input),
        "Failed to update VIP level.",
      ) as Promise<SdkworkVipAdminControllerState>;
    },

    async updateMembershipStatus(membershipId, input) {
      return runMutation(
        () => service.updateMembershipStatus(membershipId, input),
        "Failed to update VIP membership.",
        { refresh: false },
      ) as Promise<SdkworkVipAdminMembership>;
    },

    async updatePackage(packageId, input) {
      return runMutation(
        () => service.updatePackage(packageId, input),
        "Failed to update VIP package.",
      ) as Promise<SdkworkVipAdminControllerState>;
    },

    async updatePackageGroup(packageGroupId, input) {
      return runMutation(
        () => service.updatePackageGroup(packageGroupId, input),
        "Failed to update VIP package group.",
      ) as Promise<SdkworkVipAdminControllerState>;
    },
  };
}

export function useSdkworkVipAdminController(
  controller?: SdkworkVipAdminController,
): SdkworkVipAdminController {
  return useMemo(() => controller ?? createSdkworkVipAdminController(), [controller]);
}

export function useSdkworkVipAdminControllerState(
  controller: SdkworkVipAdminController,
): SdkworkVipAdminControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

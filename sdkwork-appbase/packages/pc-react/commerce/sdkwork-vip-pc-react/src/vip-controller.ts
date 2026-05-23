import {
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  createSdkworkVipService,
  type SdkworkVipDashboardData,
  type SdkworkVipMutationInput,
  type SdkworkVipPurchaseResult,
  type SdkworkVipService,
} from "./vip-service";

export type SdkworkVipView = "benefits" | "levels" | "plans";

export interface SdkworkVipControllerState {
  activeView: SdkworkVipView;
  dashboard: SdkworkVipDashboardData;
  isBootstrapped: boolean;
  isLoading: boolean;
  isMutating: boolean;
  lastError?: string;
  selectedPlanId: number | null;
}

export interface SdkworkVipController {
  bootstrap(): Promise<SdkworkVipControllerState>;
  getState(): SdkworkVipControllerState;
  purchaseSelectedPlan(input?: Omit<SdkworkVipMutationInput, "packageId"> & { packageId?: number }): Promise<SdkworkVipPurchaseResult>;
  refresh(): Promise<SdkworkVipControllerState>;
  renewSelectedPlan(input?: Omit<SdkworkVipMutationInput, "packageId"> & { packageId?: number }): Promise<SdkworkVipPurchaseResult>;
  selectPlan(packageId: number): void;
  service: SdkworkVipService;
  setView(view: SdkworkVipView): void;
  subscribe(listener: () => void): () => void;
  upgradeSelectedPlan(input?: Omit<SdkworkVipMutationInput, "packageId"> & { packageId?: number }): Promise<SdkworkVipPurchaseResult>;
}

export interface CreateSdkworkVipControllerOptions {
  initialState?: Partial<SdkworkVipControllerState>;
  service?: Partial<SdkworkVipService>;
}

function resolveSelectedPlanId(
  dashboard: SdkworkVipDashboardData,
  selectedPlanId: number | null,
): number | null {
  if (selectedPlanId && dashboard.plans.some((plan) => plan.packageId === selectedPlanId)) {
    return selectedPlanId;
  }

  return dashboard.plans.find((plan) => plan.recommended)?.packageId ?? dashboard.plans[0]?.packageId ?? null;
}

function resolvePlanId(
  state: SdkworkVipControllerState,
  input: Omit<SdkworkVipMutationInput, "packageId"> & { packageId?: number } = {},
): number {
  const packageId = input.packageId ?? state.selectedPlanId;
  if (!packageId) {
    throw new Error("Select a VIP package before continuing.");
  }

  return packageId;
}

export function createSdkworkVipController(
  options: CreateSdkworkVipControllerOptions = {},
): SdkworkVipController {
  const service: SdkworkVipService = options.service
    ? {
        ...createSdkworkVipService(),
        ...options.service,
      }
    : createSdkworkVipService();
  const listeners = new Set<() => void>();
  let state: SdkworkVipControllerState = {
    activeView: "plans",
    dashboard: service.getEmptyDashboard(),
    isBootstrapped: false,
    isLoading: false,
    isMutating: false,
    selectedPlanId: null,
    ...options.initialState,
  };
  state.selectedPlanId = resolveSelectedPlanId(state.dashboard, state.selectedPlanId);

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkVipControllerState>
      | ((currentState: SdkworkVipControllerState) => Partial<SdkworkVipControllerState>),
  ): void {
    const partial = typeof next === "function" ? next(state) : next;
    state = {
      ...state,
      ...partial,
    };
    state.selectedPlanId = resolveSelectedPlanId(state.dashboard, state.selectedPlanId);
    emit();
  }

  async function loadDashboard(): Promise<SdkworkVipDashboardData> {
    return service.getDashboard();
  }

  async function runMutation(
    callback: (packageId: number) => Promise<SdkworkVipPurchaseResult>,
    input?: Omit<SdkworkVipMutationInput, "packageId"> & { packageId?: number },
  ): Promise<SdkworkVipPurchaseResult> {
    const packageId = resolvePlanId(state, input);
    setState({
      isMutating: true,
      lastError: undefined,
      selectedPlanId: packageId,
    });

    try {
      const result = await callback(packageId);
      const dashboard = await loadDashboard();
      setState({
        dashboard,
        isBootstrapped: true,
        isMutating: false,
      });
      return result;
    } catch (error) {
      setState({
        isMutating: false,
        lastError: error instanceof Error ? error.message : "VIP request failed.",
      });
      throw error;
    }
  }

  return {
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
          lastError: error instanceof Error ? error.message : "Failed to load VIP center.",
        });
        throw error;
      }
    },

    getState() {
      return state;
    },

    async purchaseSelectedPlan(input) {
      return runMutation(
        (packageId) => service.purchaseMembership({ ...input, packageId }),
        input,
      );
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

    async renewSelectedPlan(input) {
      return runMutation(
        (packageId) => service.renewMembership({ ...input, packageId }),
        input,
      );
    },

    selectPlan(packageId) {
      setState({
        selectedPlanId: packageId,
      });
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

    async upgradeSelectedPlan(input) {
      return runMutation(
        (packageId) => service.upgradeMembership({ ...input, packageId }),
        input,
      );
    },
  };
}

export function useSdkworkVipController(
  controller?: SdkworkVipController,
): SdkworkVipController {
  return useMemo(() => controller ?? createSdkworkVipController(), [controller]);
}

export function useSdkworkVipControllerState(
  controller: SdkworkVipController,
): SdkworkVipControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

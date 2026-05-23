import {
  useMemo,
  useSyncExternalStore,
} from "react";
import type {
  SdkworkOpenPlatformAdminAccount,
  SdkworkOpenPlatformAdminAccountInput,
  SdkworkOpenPlatformAdminAccountType,
  SdkworkOpenPlatformAdminAccountUpdateInput,
  SdkworkOpenPlatformAdminDashboard,
  SdkworkOpenPlatformAdminEntryInput,
  SdkworkOpenPlatformAdminEntryUpdateInput,
  SdkworkOpenPlatformAdminPayBindingInput,
  SdkworkOpenPlatformAdminService,
} from "./open-platform-admin-service";

export interface SdkworkOpenPlatformAdminControllerState {
  activeType: SdkworkOpenPlatformAdminAccountType;
  dashboard: SdkworkOpenPlatformAdminDashboard;
  isBootstrapped: boolean;
  isLoading: boolean;
  isMutating: boolean;
  lastError?: string;
  selectedAccountId?: string | null;
}

export interface SdkworkOpenPlatformAdminController {
  bootstrap(): Promise<SdkworkOpenPlatformAdminControllerState>;
  createAccount(input: SdkworkOpenPlatformAdminAccountInput): Promise<SdkworkOpenPlatformAdminControllerState>;
  createEntry(accountId: string, input: SdkworkOpenPlatformAdminEntryInput): Promise<SdkworkOpenPlatformAdminControllerState>;
  createPayBinding(
    accountId: string,
    input: SdkworkOpenPlatformAdminPayBindingInput,
  ): Promise<SdkworkOpenPlatformAdminControllerState>;
  deleteAccount(accountId: string): Promise<SdkworkOpenPlatformAdminControllerState>;
  deleteEntry(accountId: string, entryId: string): Promise<SdkworkOpenPlatformAdminControllerState>;
  deletePayBinding(accountId: string, bindingId: string): Promise<SdkworkOpenPlatformAdminControllerState>;
  getState(): SdkworkOpenPlatformAdminControllerState;
  refresh(): Promise<SdkworkOpenPlatformAdminControllerState>;
  selectAccount(accountId: string | null): void;
  service: SdkworkOpenPlatformAdminService;
  setAccountType(type: SdkworkOpenPlatformAdminAccountType): void;
  setQrDefault(accountId: string, entryId?: string | null): Promise<SdkworkOpenPlatformAdminControllerState>;
  subscribe(listener: () => void): () => void;
  updateAccount(
    accountId: string,
    input: SdkworkOpenPlatformAdminAccountUpdateInput,
  ): Promise<SdkworkOpenPlatformAdminControllerState>;
  updateEntry(
    accountId: string,
    entryId: string,
    input: SdkworkOpenPlatformAdminEntryUpdateInput,
  ): Promise<SdkworkOpenPlatformAdminControllerState>;
}

export interface CreateSdkworkOpenPlatformAdminControllerOptions {
  initialState?: Partial<SdkworkOpenPlatformAdminControllerState>;
  service: SdkworkOpenPlatformAdminService;
}

function createEmptyDashboard(): SdkworkOpenPlatformAdminDashboard {
  return {
    accounts: [],
    entriesByAccountId: {},
    payBindingsByAccountId: {},
    summary: {
      activeAccounts: 0,
      entries: 0,
      miniApps: 0,
      officialAccounts: 0,
      payBindings: 0,
      qrDefaultAccounts: 0,
    },
  };
}

export function createSdkworkOpenPlatformAdminController(
  options: CreateSdkworkOpenPlatformAdminControllerOptions,
): SdkworkOpenPlatformAdminController {
  const listeners = new Set<() => void>();
  const service = options.service;
  let state: SdkworkOpenPlatformAdminControllerState = {
    activeType: "official_account",
    dashboard: createEmptyDashboard(),
    isBootstrapped: false,
    isLoading: false,
    isMutating: false,
    selectedAccountId: null,
    ...options.initialState,
  };

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkOpenPlatformAdminControllerState>
      | ((currentState: SdkworkOpenPlatformAdminControllerState) => Partial<SdkworkOpenPlatformAdminControllerState>),
  ): void {
    const partial = typeof next === "function" ? next(state) : next;
    state = {
      ...state,
      ...partial,
    };
    emit();
  }

  async function loadDashboard(): Promise<SdkworkOpenPlatformAdminDashboard> {
    return service.getDashboard();
  }

  function resolveSelectedAccount(
    dashboard: SdkworkOpenPlatformAdminDashboard,
    currentAccountId: string | null | undefined,
  ): SdkworkOpenPlatformAdminAccount | null {
    if (currentAccountId) {
      const selected = dashboard.accounts.find((account) => account.id === currentAccountId);
      if (selected) {
        return selected;
      }
    }
    return dashboard.accounts.find((account) => account.type === state.activeType) ?? dashboard.accounts[0] ?? null;
  }

  async function refreshDashboard(): Promise<SdkworkOpenPlatformAdminControllerState> {
    const dashboard = await loadDashboard();
    const selectedAccount = resolveSelectedAccount(dashboard, state.selectedAccountId);
    setState({
      dashboard,
      isBootstrapped: true,
      isLoading: false,
      isMutating: false,
      lastError: undefined,
      selectedAccountId: selectedAccount?.id ?? null,
    });
    return state;
  }

  async function loadDashboardWithLoading(fallbackMessage: string): Promise<SdkworkOpenPlatformAdminControllerState> {
    setState({ isLoading: true, lastError: undefined });
    try {
      return await refreshDashboard();
    } catch (error) {
      setState({
        isLoading: false,
        lastError: error instanceof Error ? error.message : fallbackMessage,
      });
      throw error;
    }
  }

  async function runMutation(
    operation: () => Promise<unknown>,
    fallbackMessage: string,
  ): Promise<SdkworkOpenPlatformAdminControllerState> {
    setState({ isMutating: true, lastError: undefined });
    try {
      await operation();
      return refreshDashboard();
    } catch (error) {
      setState({
        isMutating: false,
        lastError: error instanceof Error ? error.message : fallbackMessage,
      });
      throw error;
    }
  }

  return {
    async bootstrap() {
      return loadDashboardWithLoading("Failed to load open platform admin.");
    },
    createAccount(input) {
      return runMutation(() => service.createAccount(input), "Failed to create open platform account.");
    },
    createEntry(accountId, input) {
      return runMutation(() => service.createEntry(accountId, input), "Failed to create open platform entry.");
    },
    createPayBinding(accountId, input) {
      return runMutation(() => service.createPayBinding(accountId, input), "Failed to create payment binding.");
    },
    deleteAccount(accountId) {
      return runMutation(() => service.deleteAccount(accountId), "Failed to delete open platform account.");
    },
    deleteEntry(accountId, entryId) {
      return runMutation(() => service.deleteEntry(accountId, entryId), "Failed to delete open platform entry.");
    },
    deletePayBinding(accountId, bindingId) {
      return runMutation(() => service.deletePayBinding(accountId, bindingId), "Failed to delete payment binding.");
    },
    getState() {
      return state;
    },
    refresh() {
      return loadDashboardWithLoading("Failed to refresh open platform admin.");
    },
    selectAccount(accountId) {
      setState({ selectedAccountId: accountId });
    },
    service,
    setAccountType(type) {
      setState((currentState) => {
        const selected = currentState.dashboard.accounts.find((account) => account.type === type);
        return {
          activeType: type,
          selectedAccountId: selected?.id ?? null,
        };
      });
    },
    setQrDefault(accountId, entryId) {
      return runMutation(() => service.setQrDefault(accountId, entryId), "Failed to set QR default account.");
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    updateAccount(accountId, input) {
      return runMutation(() => service.updateAccount(accountId, input), "Failed to update open platform account.");
    },
    updateEntry(accountId, entryId, input) {
      return runMutation(() => service.updateEntry(accountId, entryId, input), "Failed to update open platform entry.");
    },
  };
}

export function useSdkworkOpenPlatformAdminController(
  controller: SdkworkOpenPlatformAdminController,
): SdkworkOpenPlatformAdminController {
  return useMemo(() => controller, [controller]);
}

export function useSdkworkOpenPlatformAdminControllerState(
  controller: SdkworkOpenPlatformAdminController,
): SdkworkOpenPlatformAdminControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

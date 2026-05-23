import {
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  createSdkworkUserMessages,
  type SdkworkUserMessagesOverrides,
} from "./user-copy.ts";
import {
  createUserCenterRegistry,
  type SdkworkUserCenterRegistry,
} from "./user.ts";
import {
  createSdkworkUserService,
  type SdkworkUserPreferences,
  type SdkworkUserProfile,
  type SdkworkUserService,
} from "./user-service.ts";

export interface SdkworkUserControllerState {
  activeSectionId: string;
  isLoading: boolean;
  isSaving: boolean;
  lastError?: string;
  preferences: SdkworkUserPreferences | null;
  profile: SdkworkUserProfile | null;
  registry: SdkworkUserCenterRegistry;
  searchValue: string;
}

export interface SdkworkUserController {
  getState(): SdkworkUserControllerState;
  load(): Promise<void>;
  selectSection(sectionId: string): void;
  service: SdkworkUserService;
  setSearchValue(value: string): void;
  subscribe(listener: () => void): () => void;
  updatePassword(currentPassword: string, nextPassword: string): Promise<void>;
  updatePreferences(preferences: Partial<SdkworkUserPreferences>): Promise<void>;
  updateProfile(profile: SdkworkUserProfile): Promise<void>;
}

export interface CreateSdkworkUserControllerOptions {
  locale?: string | null;
  messages?: SdkworkUserMessagesOverrides;
  registry?: SdkworkUserCenterRegistry;
  service?: Partial<SdkworkUserService>;
}

export function createDefaultSdkworkUserCenterRegistry(
  locale?: string | null,
  messages?: SdkworkUserMessagesOverrides,
): SdkworkUserCenterRegistry {
  const copy = createSdkworkUserMessages(locale, messages);

  return createUserCenterRegistry([
    {
      description: copy.registry.profileDescription,
      group: "account",
      id: "profile",
      keywords: copy.registry.profileKeywords,
      order: 1,
      route: "/user/sections/profile",
      title: copy.registry.sections.profile,
    },
    {
      description: copy.registry.overviewDescription,
      group: "workspace",
      id: "overview",
      keywords: copy.registry.overviewKeywords,
      order: 1,
      route: "/user/sections/overview",
      title: copy.registry.sections.overview,
    },
    {
      description: copy.registry.notificationsDescription,
      group: "workspace",
      id: "notifications",
      keywords: copy.registry.notificationsKeywords,
      order: 2,
      route: "/user/sections/notifications",
      title: copy.registry.sections.notifications,
    },
    {
      description: copy.registry.securityDescription,
      group: "security",
      id: "security",
      keywords: copy.registry.securityKeywords,
      order: 1,
      route: "/user/sections/security",
      title: copy.registry.sections.security,
    },
  ]);
}

export function createSdkworkUserController(
  options: CreateSdkworkUserControllerOptions = {},
): SdkworkUserController {
  const copy = createSdkworkUserMessages(options.locale, options.messages);
  const baseService = createSdkworkUserService({
    locale: options.locale,
    messages: options.messages,
  });
  const service = options.service
    ? {
        ...baseService,
        ...options.service,
      }
    : baseService;
  const registry = options.registry ?? createDefaultSdkworkUserCenterRegistry(options.locale, options.messages);
  const listeners = new Set<() => void>();
  let state: SdkworkUserControllerState = {
    activeSectionId: "profile",
    isLoading: false,
    isSaving: false,
    preferences: null,
    profile: null,
    registry,
    searchValue: "",
  };

  function emit() {
    for (const listener of listeners) {
      listener();
    }
  }

  function setState(
    nextState:
      | Partial<SdkworkUserControllerState>
      | ((currentState: SdkworkUserControllerState) => Partial<SdkworkUserControllerState>),
  ) {
    state = {
      ...state,
      ...(typeof nextState === "function" ? nextState(state) : nextState),
    };
    emit();
  }

  async function runSavingAction(action: () => Promise<void>) {
    setState({
      isSaving: true,
      lastError: undefined,
    });

    try {
      await action();
      setState({
        isSaving: false,
      });
    } catch (error) {
      setState({
        isSaving: false,
        lastError: error instanceof Error ? error.message : copy.common.requestFailed,
      });
      throw error;
    }
  }

  return {
    getState() {
      return state;
    },
    async load() {
      setState({
        isLoading: true,
        lastError: undefined,
      });

      try {
        const [profile, preferences] = await Promise.all([
          service.getProfile(),
          service.getPreferences(),
        ]);

        setState({
          isLoading: false,
          preferences,
          profile,
        });
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : copy.common.requestFailed,
        });
        throw error;
      }
    },
    selectSection(sectionId) {
      if (state.registry.sectionsById[sectionId]) {
        setState({
          activeSectionId: sectionId,
        });
      }
    },
    service,
    setSearchValue(value) {
      setState({
        searchValue: value,
      });
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    async updatePassword(currentPassword, nextPassword) {
      await runSavingAction(async () => {
        await service.updatePassword(currentPassword, nextPassword);
      });
    },
    async updatePreferences(preferences) {
      await runSavingAction(async () => {
        const nextPreferences = await service.updatePreferences(preferences);
        setState({
          preferences: nextPreferences,
        });
      });
    },
    async updateProfile(profile) {
      await runSavingAction(async () => {
        const nextProfile = await service.updateProfile(profile);
        setState({
          profile: nextProfile,
        });
      });
    },
  };
}

export function useSdkworkUserController(
  controller?: SdkworkUserController,
  options?: CreateSdkworkUserControllerOptions,
): SdkworkUserController {
  return useMemo(
    () => controller ?? createSdkworkUserController(options),
    [controller, options],
  );
}

export function useSdkworkUserControllerState(
  controller: SdkworkUserController,
): SdkworkUserControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}

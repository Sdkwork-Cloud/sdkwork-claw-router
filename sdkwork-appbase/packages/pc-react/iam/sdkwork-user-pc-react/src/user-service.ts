import { getAppClientWithSession } from "@sdkwork/core-pc-react";
import {
  createSdkworkUserMessages,
  type SdkworkUserMessagesOverrides,
} from "./user-copy.ts";
import { getDefaultSdkworkUserStorage } from "./user-preferences.ts";

export interface SdkworkUserProfile {
  avatarUrl?: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface SdkworkUserPreferences {
  general: {
    compactModelSelector: boolean;
    launchOnStartup: boolean;
    startMinimized: boolean;
  };
  notifications: {
    newMessages: boolean;
    securityAlerts: boolean;
    systemUpdates: boolean;
    taskCompletions: boolean;
    taskFailures: boolean;
  };
  privacy: {
    personalizedRecommendations: boolean;
    shareUsageData: boolean;
  };
  security: {
    loginAlerts: boolean;
    twoFactorAuth: boolean;
  };
}

export interface SdkworkUserProfileCapabilities {
  avatarUrlEditable: boolean;
  emailEditable: boolean;
}

export interface SdkworkUserSecurityCapabilities {
  passwordChangeEnabled: boolean;
}

export interface SdkworkUserServiceCapabilities {
  profile: SdkworkUserProfileCapabilities;
  security: SdkworkUserSecurityCapabilities;
}

export interface SdkworkUserStorageLike {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export interface SdkworkUserClient {
  notification: {
    getNotificationSettings?: () => Promise<unknown>;
    updateNotificationSettings?: (payload: RemoteNotificationSettings) => Promise<unknown>;
    updateTypeSettings?: (type: string, payload: Record<string, unknown>) => Promise<unknown>;
  };
  user: {
    changePassword?: (payload: Record<string, unknown>) => Promise<unknown>;
    getUserProfile?: () => Promise<unknown>;
    updateUserProfile?: (payload: Record<string, unknown>) => Promise<unknown>;
  };
}

export interface CreateSdkworkUserServiceOptions {
  getClient?: () => SdkworkUserClient;
  locale?: string | null;
  messages?: SdkworkUserMessagesOverrides;
  storage?: SdkworkUserStorageLike | null;
}

export interface SdkworkUserService {
  capabilities: SdkworkUserServiceCapabilities;
  getPreferences(): Promise<SdkworkUserPreferences>;
  getProfile(): Promise<SdkworkUserProfile>;
  updatePassword(currentPassword: string, nextPassword: string): Promise<void>;
  updatePreferences(preferences: Partial<SdkworkUserPreferences>): Promise<SdkworkUserPreferences>;
  updateProfile(profile: SdkworkUserProfile): Promise<SdkworkUserProfile>;
}

interface SdkworkAppSdkEnvelope<T> {
  code?: number | string;
  data?: T;
  message?: string;
  msg?: string;
}

interface RemoteNotificationTypeSettings {
  enableEmail?: boolean;
  enableInApp?: boolean;
  enablePush?: boolean;
  enableSms?: boolean;
}

interface RemoteNotificationSettings {
  enableEmail?: boolean;
  enableInApp?: boolean;
  enablePush?: boolean;
  enableSms?: boolean;
  notificationSound?: string;
  quietHoursEnd?: string;
  quietHoursStart?: string;
  typeSettings?: Record<string, RemoteNotificationTypeSettings>;
  vibrationEnabled?: boolean;
}

const SETTINGS_OVERLAY_STORAGE_KEY = "sdkwork-user-settings-overlay";
const TASK_NOTIFICATION_TYPE = "TASK";
const MESSAGE_NOTIFICATION_TYPE = "MESSAGE";
const ALERT_NOTIFICATION_TYPE_CANDIDATES = ["ALERT", "SECURITY"];

const DEFAULT_GENERAL_PREFERENCES: SdkworkUserPreferences["general"] = {
  compactModelSelector: true,
  launchOnStartup: false,
  startMinimized: false,
};

const DEFAULT_PRIVACY_PREFERENCES: SdkworkUserPreferences["privacy"] = {
  personalizedRecommendations: false,
  shareUsageData: false,
};

const DEFAULT_SECURITY_PREFERENCES: SdkworkUserPreferences["security"] = {
  loginAlerts: true,
  twoFactorAuth: false,
};

const DEFAULT_USER_SERVICE_CAPABILITIES: SdkworkUserServiceCapabilities = {
  profile: {
    avatarUrlEditable: true,
    emailEditable: true,
  },
  security: {
    passwordChangeEnabled: true,
  },
};

function isSuccessCode(code: number | string | undefined): boolean {
  if (code === undefined || code === null) {
    return true;
  }

  const normalized = String(code).trim();
  return normalized === "0" || normalized === "200" || normalized === "2000";
}

function unwrapAppSdkResponse<T>(
  payload: unknown,
  fallbackMessage: string,
): T {
  if (!payload || typeof payload !== "object") {
    return payload as T;
  }

  if (!("code" in payload) && !("data" in payload)) {
    return payload as T;
  }

  const envelope = payload as SdkworkAppSdkEnvelope<T>;
  if (!isSuccessCode(envelope.code)) {
    throw new Error(String(envelope.message || envelope.msg || fallbackMessage).trim());
  }

  return (envelope.data ?? null) as T;
}

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || undefined;
}

function readSettingsOverlay(storage: SdkworkUserStorageLike | null): Pick<SdkworkUserPreferences, "general" | "privacy" | "security"> {
  if (!storage) {
    return {
      general: { ...DEFAULT_GENERAL_PREFERENCES },
      privacy: { ...DEFAULT_PRIVACY_PREFERENCES },
      security: { ...DEFAULT_SECURITY_PREFERENCES },
    };
  }

  const rawValue = storage.getItem(SETTINGS_OVERLAY_STORAGE_KEY);
  if (!rawValue) {
    return {
      general: { ...DEFAULT_GENERAL_PREFERENCES },
      privacy: { ...DEFAULT_PRIVACY_PREFERENCES },
      security: { ...DEFAULT_SECURITY_PREFERENCES },
    };
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<Pick<SdkworkUserPreferences, "general" | "privacy" | "security">>;
    return {
      general: { ...DEFAULT_GENERAL_PREFERENCES, ...parsed.general },
      privacy: { ...DEFAULT_PRIVACY_PREFERENCES, ...parsed.privacy },
      security: { ...DEFAULT_SECURITY_PREFERENCES, ...parsed.security },
    };
  } catch {
    return {
      general: { ...DEFAULT_GENERAL_PREFERENCES },
      privacy: { ...DEFAULT_PRIVACY_PREFERENCES },
      security: { ...DEFAULT_SECURITY_PREFERENCES },
    };
  }
}

function writeSettingsOverlay(
  storage: SdkworkUserStorageLike | null,
  overlay: Pick<SdkworkUserPreferences, "general" | "privacy" | "security">,
): void {
  storage?.setItem(SETTINGS_OVERLAY_STORAGE_KEY, JSON.stringify(overlay));
}

function resolveNotificationTypeSetting(
  settings: RemoteNotificationSettings,
  notificationTypes: string[],
  channel: keyof RemoteNotificationTypeSettings,
  fallback: boolean,
): boolean {
  for (const notificationType of notificationTypes) {
    const value = settings.typeSettings?.[notificationType]?.[channel];
    if (value !== undefined) {
      return value;
    }
  }

  return fallback;
}

function buildPreferencesFromNotificationSettings(
  settings: RemoteNotificationSettings,
  overlay: Pick<SdkworkUserPreferences, "general" | "privacy" | "security">,
): SdkworkUserPreferences {
  const emailEnabled = settings.enableEmail ?? true;
  const inAppEnabled = settings.enableInApp ?? true;

  return {
    general: overlay.general,
    notifications: {
      newMessages: resolveNotificationTypeSetting(
        settings,
        [MESSAGE_NOTIFICATION_TYPE],
        "enableInApp",
        inAppEnabled,
      ),
      securityAlerts: resolveNotificationTypeSetting(
        settings,
        ALERT_NOTIFICATION_TYPE_CANDIDATES,
        "enableEmail",
        emailEnabled,
      ),
      systemUpdates: emailEnabled,
      taskCompletions: resolveNotificationTypeSetting(
        settings,
        [TASK_NOTIFICATION_TYPE],
        "enableInApp",
        inAppEnabled,
      ),
      taskFailures: resolveNotificationTypeSetting(
        settings,
        [TASK_NOTIFICATION_TYPE],
        "enableEmail",
        emailEnabled,
      ),
    },
    privacy: overlay.privacy,
    security: overlay.security,
  };
}

function buildNotificationSettingsUpdate(
  current: RemoteNotificationSettings,
  notifications: Partial<SdkworkUserPreferences["notifications"]>,
): RemoteNotificationSettings {
  return {
    enableEmail: notifications.systemUpdates ?? current.enableEmail,
    enableInApp: current.enableInApp,
    enablePush: current.enablePush,
    enableSms: current.enableSms,
    notificationSound: current.notificationSound,
    quietHoursEnd: current.quietHoursEnd,
    quietHoursStart: current.quietHoursStart,
    vibrationEnabled: current.vibrationEnabled,
  };
}

function buildNotificationTypeSettingsUpdates(
  currentSettings: RemoteNotificationSettings,
  notifications: Partial<SdkworkUserPreferences["notifications"]>,
): Array<Record<string, unknown>> {
  const updates: Array<Record<string, unknown>> = [];

  if (notifications.taskFailures !== undefined || notifications.taskCompletions !== undefined) {
    updates.push({
      enableEmail: notifications.taskFailures,
      enableInApp: notifications.taskCompletions,
      type: TASK_NOTIFICATION_TYPE,
    });
  }

  if (notifications.securityAlerts !== undefined) {
    updates.push({
      enableEmail: notifications.securityAlerts,
      type: currentSettings.typeSettings?.SECURITY ? "SECURITY" : "ALERT",
    });
  }

  if (notifications.newMessages !== undefined) {
    updates.push({
      enableInApp: notifications.newMessages,
      type: MESSAGE_NOTIFICATION_TYPE,
    });
  }

  return updates;
}

function toUserProfile(profile: {
  avatar?: string;
  email?: string;
  nickname?: string;
}): SdkworkUserProfile {
  const [firstName = "", ...rest] = (profile.nickname || "")
    .split(/\s+/)
    .map((value) => value.trim())
    .filter(Boolean);

  return {
    avatarUrl: normalizeOptionalString(profile.avatar),
    email: normalizeOptionalString(profile.email) || "",
    firstName,
    lastName: rest.join(" "),
  };
}

export function createSdkworkUserService(
  options: CreateSdkworkUserServiceOptions = {},
): SdkworkUserService {
  const copy = createSdkworkUserMessages(options.locale, options.messages);
  const getClient = options.getClient ?? (() => getAppClientWithSession() as unknown as SdkworkUserClient);
  const storage = options.storage ?? getDefaultSdkworkUserStorage();

  return {
    capabilities: DEFAULT_USER_SERVICE_CAPABILITIES,
    async getPreferences() {
      const client = getClient();
      const settings = unwrapAppSdkResponse<RemoteNotificationSettings>(
        await client.notification.getNotificationSettings?.(),
        copy.common.requestFailed,
      ) || {};

      return buildPreferencesFromNotificationSettings(settings, readSettingsOverlay(storage));
    },

    async getProfile() {
      const client = getClient();
      const profile = unwrapAppSdkResponse<{
        avatar?: string;
        email?: string;
        nickname?: string;
      }>(
        await client.user.getUserProfile?.(),
        copy.common.requestFailed,
      );

      return toUserProfile(profile);
    },

    async updatePassword(currentPassword, nextPassword) {
      const client = getClient();
      await client.user.changePassword?.({
        confirmPassword: nextPassword,
        newPassword: nextPassword,
        oldPassword: currentPassword,
      });
    },

    async updatePreferences(preferences) {
      const client = getClient();
      const currentOverlay = readSettingsOverlay(storage);
      const nextOverlay = {
        general: { ...currentOverlay.general, ...preferences.general },
        privacy: { ...currentOverlay.privacy, ...preferences.privacy },
        security: { ...currentOverlay.security, ...preferences.security },
      };
      writeSettingsOverlay(storage, nextOverlay);

      const currentSettings = unwrapAppSdkResponse<RemoteNotificationSettings>(
        await client.notification.getNotificationSettings?.(),
        copy.common.requestFailed,
      ) || {};

      if (!preferences.notifications) {
        return buildPreferencesFromNotificationSettings(currentSettings, nextOverlay);
      }

      const updatedSettings = unwrapAppSdkResponse<RemoteNotificationSettings>(
        await client.notification.updateNotificationSettings?.(
          buildNotificationSettingsUpdate(currentSettings, preferences.notifications),
        ),
        copy.common.requestFailed,
      ) || currentSettings;

      const typeSettingsUpdates = buildNotificationTypeSettingsUpdates(
        updatedSettings,
        preferences.notifications,
      );

      for (const update of typeSettingsUpdates) {
        await client.notification.updateTypeSettings?.(String(update.type), update);
      }

      return buildPreferencesFromNotificationSettings(updatedSettings, nextOverlay);
    },

    async updateProfile(profile) {
      const client = getClient();
      const updated = unwrapAppSdkResponse<{
        avatar?: string;
        email?: string;
      }>(
        await client.user.updateUserProfile?.({
          email: profile.email,
          nickname: [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || undefined,
        }),
        copy.common.requestFailed,
      ) || {};

      return {
        avatarUrl: normalizeOptionalString(updated.avatar) || profile.avatarUrl,
        email: normalizeOptionalString(updated.email) || profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
      };
    },
  };
}

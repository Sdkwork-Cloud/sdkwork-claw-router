import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readApiRecord,
  readBoolean,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  SettingsDataResponse as SdkSettingsDataResponse,
  UpdateSettingsRequest as SdkUpdateSettingsRequest,
} from '@sdkwork/clawrouter-app-sdk';

type SdkSettingsNotifications = SdkSettingsDataResponse['notifications'];

interface SettingsNotifications {
  billReminder: SdkSettingsNotifications['billReminder'];
  quotaWarning: SdkSettingsNotifications['quotaWarning'];
  apiMonitor: SdkSettingsNotifications['apiMonitor'];
}

export interface SettingsData {
  language: SdkSettingsDataResponse['language'];
  timezone: SdkSettingsDataResponse['timezone'];
  webhookUrl: SdkSettingsDataResponse['webhookUrl'];
  notifications: SettingsNotifications;
}

export class SettingsService {
  static async fetchSettings(): Promise<SettingsData> {
    const result = await getClawRouterAppSdkClient().iam.users.settings.retrieve();
    ensurePlusApiSuccess(result, 'Failed to fetch settings');
    return normalizeSettings(readApiRecord(result));
  }

  static async updateSettings(data: SettingsData): Promise<void> {
    const result = await getClawRouterAppSdkClient().iam.users.settings.update(toUpdateSettingsRequest(data));
    ensurePlusApiSuccess(result, 'Failed to update settings');
  }
}

function toUpdateSettingsRequest(data: SettingsData): SdkUpdateSettingsRequest {
  return {
    language: requiredText(data.language, 'language'),
    timezone: requiredText(data.timezone, 'timezone'),
    webhookUrl: webhookUrl(data.webhookUrl),
    notifications: {
      billReminder: Boolean(data.notifications.billReminder),
      quotaWarning: Boolean(data.notifications.quotaWarning),
      apiMonitor: Boolean(data.notifications.apiMonitor),
    },
  };
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function webhookUrl(value: string): string {
  const normalized = value.trim();
  if (!normalized) {
    return '';
  }
  if (!/^https?:\/\//i.test(normalized)) {
    throw new Error('webhookUrl must use http or https');
  }
  return normalized;
}

function normalizeSettings(data: ApiRecord): SettingsData {
  const notifications = isRecord(data.notifications) ? data.notifications : {};
  return {
    language: readString(data, 'language'),
    timezone: readString(data, 'timezone'),
    webhookUrl: readString(data, 'webhookUrl'),
    notifications: {
      billReminder: readBoolean(notifications, 'billReminder'),
      quotaWarning: readBoolean(notifications, 'quotaWarning'),
      apiMonitor: readBoolean(notifications, 'apiMonitor'),
    },
  };
}

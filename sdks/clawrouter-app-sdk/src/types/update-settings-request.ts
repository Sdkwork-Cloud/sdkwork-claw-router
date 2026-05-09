import type { SettingsNotifications } from './settings-notifications';

export interface UpdateSettingsRequest {
  language: string;
  notifications: SettingsNotifications;
  timezone: string;
  webhookUrl: string;
}

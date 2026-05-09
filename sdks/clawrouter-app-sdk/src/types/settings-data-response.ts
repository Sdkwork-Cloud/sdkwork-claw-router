import type { SettingsNotifications } from './settings-notifications';

export interface SettingsDataResponse {
  language: string;
  notifications: SettingsNotifications;
  timezone: string;
  webhookUrl: string;
}

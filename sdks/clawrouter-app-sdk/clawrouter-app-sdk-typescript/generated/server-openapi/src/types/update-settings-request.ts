import type { SettingsNotifications } from './settings-notifications';

/** Update settings request schema exposed by Claw Router. */
export interface UpdateSettingsRequest {
  /** Language field on update settings request. */
  language: string;
  /** Notifications field on update settings request. */
  notifications: SettingsNotifications;
  /** Timezone field on update settings request. */
  timezone: string;
  /** Webhook url field on update settings request. */
  webhookUrl: string;
}

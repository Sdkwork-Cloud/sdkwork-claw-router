import type { AdminAppConfigStandard } from './admin-app-config-standard';
import type { AdminAppPortalConfig } from './admin-app-portal-config';

export interface AdminAppConfig {
  portal?: AdminAppPortalConfig;
  standard: AdminAppConfigStandard;
}

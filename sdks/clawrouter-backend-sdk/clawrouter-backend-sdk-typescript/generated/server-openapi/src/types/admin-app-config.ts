import type { AdminAppConfigStandard } from './admin-app-config-standard';
import type { AdminAppPortalConfig } from './admin-app-portal-config';
import type { JsonValue } from './json-value';

/** Admin app config schema exposed by Claw Router. */
export interface AdminAppConfig {
  /** Portal field on admin app config. */
  portal?: AdminAppPortalConfig;
  /** Standard field on admin app config. */
  standard: AdminAppConfigStandard;
}

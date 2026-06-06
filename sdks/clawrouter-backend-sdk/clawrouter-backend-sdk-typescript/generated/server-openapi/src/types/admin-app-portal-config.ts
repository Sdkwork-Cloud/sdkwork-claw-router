import type { JsonValue } from './json-value';

/** Admin app portal config schema exposed by Claw Router. */
export interface AdminAppPortalConfig {
  /** Market status field on admin app portal config. */
  marketStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
}

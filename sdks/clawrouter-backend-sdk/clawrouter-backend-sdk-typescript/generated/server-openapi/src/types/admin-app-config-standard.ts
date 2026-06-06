import type { JsonValue } from './json-value';

/** Admin app config standard schema exposed by Claw Router. */
export interface AdminAppConfigStandard {
  /** Stable PlusApp identity key. Must use lowercase kebab-case. */
  appKey: string;
}

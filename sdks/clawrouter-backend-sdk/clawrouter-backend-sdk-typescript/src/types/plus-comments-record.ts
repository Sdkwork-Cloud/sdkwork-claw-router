import type { JsonValue } from './json-value';

/** Plus comments record schema exposed by Claw Router. */
export interface PlusCommentsRecord {
  /** Author field on plus comments record. */
  author?: Record<string, JsonValue>;
  /** Device info field on plus comments record. */
  device_info?: string;
  /** Ip address field on plus comments record. */
  ip_address?: string;
  /** Parent id field on plus comments record. */
  parent_id?: string;
  /** Path field on plus comments record. */
  path?: string;
  /** User id field on plus comments record. */
  user_id?: string;
}

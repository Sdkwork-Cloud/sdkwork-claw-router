import type { JsonValue } from './json-value';

/** Commerce standard command request schema exposed by Claw Router. */
export interface CommerceStandardCommandRequest {
  /** Client request no field on commerce standard command request. */
  clientRequestNo?: string;
  /** Metadata field on commerce standard command request. */
  metadata?: Record<string, JsonValue>;
  /** Note field on commerce standard command request. */
  note?: string;
}

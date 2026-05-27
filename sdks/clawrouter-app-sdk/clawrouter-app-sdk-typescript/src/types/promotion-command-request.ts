import type { JsonValue } from './json-value';

/** Promotion command request schema exposed by Claw Router. */
export interface PromotionCommandRequest {
  /** Client request no field on promotion command request. */
  clientRequestNo?: string;
  /** Metadata field on promotion command request. */
  metadata?: Record<string, JsonValue>;
  /** Note field on promotion command request. */
  note?: string;
}

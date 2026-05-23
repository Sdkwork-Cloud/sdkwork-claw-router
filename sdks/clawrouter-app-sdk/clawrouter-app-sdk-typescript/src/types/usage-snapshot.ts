import type { JsonValue } from './json-value';

/** Usage snapshot schema exposed by Claw Router. */
export interface UsageSnapshot {
  /** Cached tokens field on usage snapshot. */
  cachedTokens?: number;
  /** Input tokens field on usage snapshot. */
  inputTokens?: number;
  /** Output tokens field on usage snapshot. */
  outputTokens?: number;
  /** Total tokens field on usage snapshot. */
  totalTokens?: number;
}

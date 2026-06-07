import type { JsonValue } from './json-value';

/** Messaging route simulation response schema exposed by Claw Router. */
export interface MessagingRouteSimulationResponse {
  /** Matched field on messaging route simulation response. */
  matched: boolean;
  /** Route rule id field on messaging route simulation response. */
  routeRuleId?: string | null;
  /** Targets field on messaging route simulation response. */
  targets: Record<string, JsonValue>[];
}

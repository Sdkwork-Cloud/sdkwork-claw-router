/** Routing usage snapshot schema exposed by Claw Router. */
export interface RoutingUsageSnapshot {
  /** Chart data field on routing usage snapshot. */
  chartData: Record<string, unknown>[];
  /** Model stats field on routing usage snapshot. */
  modelStats: Record<string, unknown>[];
}

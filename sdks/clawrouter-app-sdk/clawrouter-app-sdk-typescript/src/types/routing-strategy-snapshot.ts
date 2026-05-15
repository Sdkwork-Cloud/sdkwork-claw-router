/** Routing strategy snapshot schema exposed by Claw Router. */
export interface RoutingStrategySnapshot {
  /** Mapping rules field on routing strategy snapshot. */
  mappingRules: Record<string, unknown>[];
  /** Strategy field on routing strategy snapshot. */
  strategy: 'latency' | 'weighted' | 'cost';
}

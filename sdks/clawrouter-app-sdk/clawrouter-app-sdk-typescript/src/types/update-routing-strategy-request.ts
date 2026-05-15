/** Update routing strategy request schema exposed by Claw Router. */
export interface UpdateRoutingStrategyRequest {
  /** Mapping rules field on update routing strategy request. */
  mappingRules: Record<string, unknown>[];
  /** Strategy field on update routing strategy request. */
  strategy: 'latency' | 'weighted' | 'cost';
}

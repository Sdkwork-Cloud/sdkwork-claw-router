export interface UpdateRoutingStrategyRequest {
  mappingRules: Record<string, unknown>[];
  strategy: 'latency' | 'weighted' | 'cost';
}

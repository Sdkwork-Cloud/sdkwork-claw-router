export interface RoutingStrategySnapshot {
  mappingRules: Record<string, unknown>[];
  strategy: 'latency' | 'weighted' | 'cost';
}

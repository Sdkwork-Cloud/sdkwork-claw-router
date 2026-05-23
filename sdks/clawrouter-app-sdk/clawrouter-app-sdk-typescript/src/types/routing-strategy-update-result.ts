import type { UpdateRoutingStrategyResponse } from './update-routing-strategy-response';

/** Routing strategy update result schema exposed by Claw Router. */
export interface RoutingStrategyUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on routing strategy update result. */
  data?: UpdateRoutingStrategyResponse;
  /** Human-readable response message. */
  msg?: string;
}

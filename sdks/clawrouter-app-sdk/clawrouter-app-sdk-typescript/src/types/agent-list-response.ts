import type { AgentItem } from './agent-item';

/** Agent list response schema exposed by Claw Router. */
export interface AgentListResponse {
  /** Items field on agent list response. */
  items: AgentItem[];
}

import type { AgentRunItem } from './agent-run-item';

/** Agent run list response schema exposed by Claw Router. */
export interface AgentRunListResponse {
  /** Items field on agent run list response. */
  items: AgentRunItem[];
}

import type { AgentRunItem } from './agent-run-item';

/** Agent run response schema exposed by Claw Router. */
export interface AgentRunResponse {
  /** Item field on agent run response. */
  item: AgentRunItem;
}

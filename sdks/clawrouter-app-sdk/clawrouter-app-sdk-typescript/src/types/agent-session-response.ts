import type { AgentSessionItem } from './agent-session-item';

/** Agent session response schema exposed by Claw Router. */
export interface AgentSessionResponse {
  /** Item field on agent session response. */
  item: AgentSessionItem;
}

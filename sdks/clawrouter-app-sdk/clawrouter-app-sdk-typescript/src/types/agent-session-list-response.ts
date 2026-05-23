import type { AgentSessionItem } from './agent-session-item';

/** Agent session list response schema exposed by Claw Router. */
export interface AgentSessionListResponse {
  /** Items field on agent session list response. */
  items: AgentSessionItem[];
}

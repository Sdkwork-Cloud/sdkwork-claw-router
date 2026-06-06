import type { AgentSessionItem } from './agent-session-item';

/** Agent sessions retrieve result schema exposed by Claw Router. */
export interface AgentSessionsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on agent sessions retrieve result. */
  data?: AgentSessionItem;
  /** Human-readable response message. */
  msg?: string;
}

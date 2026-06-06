import type { AgentSessionListResponse } from './agent-session-list-response';

/** Agent sessions list result schema exposed by Claw Router. */
export interface AgentSessionsListResult {
  /** Business response code. */
  code: string;
  /** Data field on agent sessions list result. */
  data?: AgentSessionListResponse;
  /** Human-readable response message. */
  msg?: string;
}

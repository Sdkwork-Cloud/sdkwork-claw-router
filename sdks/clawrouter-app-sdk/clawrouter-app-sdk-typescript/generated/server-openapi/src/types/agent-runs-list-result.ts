import type { AgentRunListResponse } from './agent-run-list-response';

/** Agent runs list result schema exposed by Claw Router. */
export interface AgentRunsListResult {
  /** Business response code. */
  code: string;
  /** Data field on agent runs list result. */
  data?: AgentRunListResponse;
  /** Human-readable response message. */
  msg?: string;
}

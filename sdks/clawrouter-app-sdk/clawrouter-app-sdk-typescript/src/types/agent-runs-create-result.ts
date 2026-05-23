import type { AgentRunResponse } from './agent-run-response';

/** Agent runs create result schema exposed by Claw Router. */
export interface AgentRunsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on agent runs create result. */
  data?: AgentRunResponse;
  /** Human-readable response message. */
  msg?: string;
}

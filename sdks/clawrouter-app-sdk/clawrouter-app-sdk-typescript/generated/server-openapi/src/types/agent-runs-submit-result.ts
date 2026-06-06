import type { AgentRunResponse } from './agent-run-response';

/** Agent runs submit result schema exposed by Claw Router. */
export interface AgentRunsSubmitResult {
  /** Business response code. */
  code: string;
  /** Data field on agent runs submit result. */
  data?: AgentRunResponse;
  /** Human-readable response message. */
  msg?: string;
}

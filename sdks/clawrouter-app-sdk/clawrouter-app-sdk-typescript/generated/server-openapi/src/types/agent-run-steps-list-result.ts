import type { AgentRunStepListResponse } from './agent-run-step-list-response';

/** Agent run steps list result schema exposed by Claw Router. */
export interface AgentRunStepsListResult {
  /** Business response code. */
  code: string;
  /** Data field on agent run steps list result. */
  data?: AgentRunStepListResponse;
  /** Human-readable response message. */
  msg?: string;
}

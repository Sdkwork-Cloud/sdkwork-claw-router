import type { AgentRunStepResponse } from './agent-run-step-response';

/** Agent run steps create result schema exposed by Claw Router. */
export interface AgentRunStepsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on agent run steps create result. */
  data?: AgentRunStepResponse;
  /** Human-readable response message. */
  msg?: string;
}

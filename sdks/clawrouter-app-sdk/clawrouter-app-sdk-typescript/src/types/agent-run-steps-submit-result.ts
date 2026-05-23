import type { AgentRunStepResponse } from './agent-run-step-response';

/** Agent run steps submit result schema exposed by Claw Router. */
export interface AgentRunStepsSubmitResult {
  /** Business response code. */
  code: string;
  /** Data field on agent run steps submit result. */
  data?: AgentRunStepResponse;
  /** Human-readable response message. */
  msg?: string;
}

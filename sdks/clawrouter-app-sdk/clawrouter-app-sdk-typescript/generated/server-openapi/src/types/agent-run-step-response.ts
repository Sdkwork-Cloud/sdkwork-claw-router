import type { AgentRunStepItem } from './agent-run-step-item';

/** Agent run step response schema exposed by Claw Router. */
export interface AgentRunStepResponse {
  /** Item field on agent run step response. */
  item: AgentRunStepItem;
}

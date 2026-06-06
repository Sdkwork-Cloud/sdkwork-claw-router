import type { AgentRunStepItem } from './agent-run-step-item';

/** Agent run step list response schema exposed by Claw Router. */
export interface AgentRunStepListResponse {
  /** Items field on agent run step list response. */
  items: AgentRunStepItem[];
}

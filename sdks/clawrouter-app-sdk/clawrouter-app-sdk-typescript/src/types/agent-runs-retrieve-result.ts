import type { AgentRunItem } from './agent-run-item';

/** Agent runs retrieve result schema exposed by Claw Router. */
export interface AgentRunsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on agent runs retrieve result. */
  data?: AgentRunItem;
  /** Human-readable response message. */
  msg?: string;
}

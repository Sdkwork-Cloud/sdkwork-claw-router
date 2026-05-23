import type { AgentItemResponse } from './agent-item-response';

/** Agent definitions create result schema exposed by Claw Router. */
export interface AgentDefinitionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on agent definitions create result. */
  data?: AgentItemResponse;
  /** Human-readable response message. */
  msg?: string;
}

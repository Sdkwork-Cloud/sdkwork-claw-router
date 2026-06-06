import type { AgentItem } from './agent-item';

/** Agent definitions retrieve result schema exposed by Claw Router. */
export interface AgentDefinitionsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on agent definitions retrieve result. */
  data?: AgentItem;
  /** Human-readable response message. */
  msg?: string;
}

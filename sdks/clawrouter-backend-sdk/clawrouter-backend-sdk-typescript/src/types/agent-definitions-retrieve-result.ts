import type { AdminAgentItem } from './admin-agent-item';

/** Agent definitions retrieve result schema exposed by Claw Router. */
export interface AgentDefinitionsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on agent definitions retrieve result. */
  data?: AdminAgentItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}

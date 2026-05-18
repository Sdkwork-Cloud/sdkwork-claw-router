import type { AdminAgentListResponse } from './admin-agent-list-response';

/** Agent definitions list result schema exposed by Claw Router. */
export interface AgentDefinitionsListResult {
  /** Business response code. */
  code: string;
  /** Data field on agent definitions list result. */
  data?: AdminAgentListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}

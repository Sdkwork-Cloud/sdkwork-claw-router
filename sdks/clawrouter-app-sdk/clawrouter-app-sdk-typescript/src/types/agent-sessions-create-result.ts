import type { AgentSessionResponse } from './agent-session-response';

/** Agent sessions create result schema exposed by Claw Router. */
export interface AgentSessionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on agent sessions create result. */
  data?: AgentSessionResponse;
  /** Human-readable response message. */
  msg?: string;
}

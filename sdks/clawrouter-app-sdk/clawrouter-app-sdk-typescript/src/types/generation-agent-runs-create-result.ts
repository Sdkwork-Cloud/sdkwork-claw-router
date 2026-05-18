import type { GenerationAgentRunCreateResponse } from './generation-agent-run-create-response';

/** Generation agent runs create result schema exposed by Claw Router. */
export interface GenerationAgentRunsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on generation agent runs create result. */
  data?: GenerationAgentRunCreateResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}

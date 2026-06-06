import type { JsonValue } from './json-value';

/** Agent run create request schema exposed by Claw Router. */
export interface AgentRunCreateRequest {
  /** Agent id field on agent run create request. */
  agentId: string;
  /** Agent version id field on agent run create request. */
  agentVersionId: string;
  /** Execution mode field on agent run create request. */
  executionMode?: string;
  /** Input message field on agent run create request. */
  inputMessage?: string;
  /** Memory space id field on agent run create request. */
  memorySpaceId?: string;
  /** Metadata field on agent run create request. */
  metadata?: Record<string, JsonValue>;
  /** Model field on agent run create request. */
  model?: string;
  /** Runtime field on agent run create request. */
  runtime?: string;
  /** Source surface field on agent run create request. */
  sourceSurface?: string;
  /** Trace id field on agent run create request. */
  traceId?: string;
}

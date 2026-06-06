import type { JsonValue } from './json-value';
import type { UsageSnapshot } from './usage-snapshot';

/** Agent run complete request schema exposed by Claw Router. */
export interface AgentRunCompleteRequest {
  /** Error message masked field on agent run complete request. */
  errorMessageMasked?: string;
  /** Metadata field on agent run complete request. */
  metadata?: Record<string, JsonValue>;
  /** Output message field on agent run complete request. */
  outputMessage?: string;
  /** Status field on agent run complete request. */
  status?: 'completed' | 'failed' | 'cancelled';
  /** Usage json field on agent run complete request. */
  usageJson?: UsageSnapshot;
}

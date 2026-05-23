import type { JsonValue } from './json-value';
import type { UsageSnapshot } from './usage-snapshot';

/** Agent run step complete request schema exposed by Claw Router. */
export interface AgentRunStepCompleteRequest {
  /** Error message masked field on agent run step complete request. */
  errorMessageMasked?: string;
  /** Metadata field on agent run step complete request. */
  metadata?: Record<string, JsonValue>;
  /** Output json field on agent run step complete request. */
  outputJson?: Record<string, JsonValue>;
  /** Status field on agent run step complete request. */
  status?: 'completed' | 'failed' | 'cancelled';
  /** Usage json field on agent run step complete request. */
  usageJson?: UsageSnapshot;
}

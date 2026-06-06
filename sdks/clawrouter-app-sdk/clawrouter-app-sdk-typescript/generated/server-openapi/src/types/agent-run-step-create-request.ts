import type { JsonValue } from './json-value';
import type { UsageSnapshot } from './usage-snapshot';

/** Agent run step create request schema exposed by Claw Router. */
export interface AgentRunStepCreateRequest {
  /** Input json field on agent run step create request. */
  inputJson?: Record<string, JsonValue>;
  /** Metadata field on agent run step create request. */
  metadata?: Record<string, JsonValue>;
  /** Model field on agent run step create request. */
  model?: string;
  /** Output json field on agent run step create request. */
  outputJson?: Record<string, JsonValue>;
  /** Runtime invocation id field on agent run step create request. */
  runtimeInvocationId?: string;
  /** Status field on agent run step create request. */
  status?: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  /** Step type field on agent run step create request. */
  stepType?: 'input' | 'model' | 'tool' | 'memory' | 'runtime' | 'system' | 'custom';
  /** Title field on agent run step create request. */
  title?: string;
  /** Tool name field on agent run step create request. */
  toolName?: string;
  /** Usage json field on agent run step create request. */
  usageJson?: UsageSnapshot;
}

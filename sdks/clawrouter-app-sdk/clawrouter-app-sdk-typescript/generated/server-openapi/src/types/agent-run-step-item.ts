/** Agent run step item schema exposed by Claw Router. */
export interface AgentRunStepItem {
  /** Cached tokens field on agent run step item. */
  cachedTokens?: string | null;
  /** Completed at field on agent run step item. */
  completedAt?: string | null;
  /** Created at field on agent run step item. */
  createdAt: string;
  /** Id field on agent run step item. */
  id: string;
  /** Input tokens field on agent run step item. */
  inputTokens?: string | null;
  /** Latency ms field on agent run step item. */
  latencyMs?: string | null;
  /** Model field on agent run step item. */
  model?: string | null;
  /** Output tokens field on agent run step item. */
  outputTokens?: string | null;
  /** Run id field on agent run step item. */
  runId: string;
  /** Runtime invocation id field on agent run step item. */
  runtimeInvocationId?: string | null;
  /** Started at field on agent run step item. */
  startedAt?: string | null;
  /** Status field on agent run step item. */
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  /** Step index field on agent run step item. */
  stepIndex: string;
  /** Step type field on agent run step item. */
  stepType: 'input' | 'model' | 'tool' | 'memory' | 'runtime' | 'system' | 'custom';
  /** Title field on agent run step item. */
  title?: string | null;
  /** Tool name field on agent run step item. */
  toolName?: string | null;
  /** Total tokens field on agent run step item. */
  totalTokens?: string | null;
}

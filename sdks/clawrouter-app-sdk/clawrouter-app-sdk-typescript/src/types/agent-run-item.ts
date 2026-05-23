/** Agent run item schema exposed by Claw Router. */
export interface AgentRunItem {
  /** Agent id field on agent run item. */
  agentId: string;
  /** Agent version id field on agent run item. */
  agentVersionId: string;
  /** Cached tokens field on agent run item. */
  cachedTokens?: number | null;
  /** Completed at field on agent run item. */
  completedAt?: string | null;
  /** Created at field on agent run item. */
  createdAt: string;
  /** Error message masked field on agent run item. */
  errorMessageMasked?: string | null;
  /** Execution mode field on agent run item. */
  executionMode: string;
  /** Id field on agent run item. */
  id: string;
  /** Input message field on agent run item. */
  inputMessage?: string | null;
  /** Input tokens field on agent run item. */
  inputTokens?: number | null;
  /** Memory space id field on agent run item. */
  memorySpaceId?: string | null;
  /** Model field on agent run item. */
  model?: string | null;
  /** Output message field on agent run item. */
  outputMessage?: string | null;
  /** Output tokens field on agent run item. */
  outputTokens?: number | null;
  /** Request id field on agent run item. */
  requestId: string;
  /** Runtime field on agent run item. */
  runtime?: string | null;
  /** Session id field on agent run item. */
  sessionId?: string | null;
  /** Source surface field on agent run item. */
  sourceSurface: string;
  /** Started at field on agent run item. */
  startedAt?: string | null;
  /** Status field on agent run item. */
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  /** Total steps field on agent run item. */
  totalSteps: number;
  /** Total tokens field on agent run item. */
  totalTokens?: number | null;
  /** Trace id field on agent run item. */
  traceId?: string | null;
}

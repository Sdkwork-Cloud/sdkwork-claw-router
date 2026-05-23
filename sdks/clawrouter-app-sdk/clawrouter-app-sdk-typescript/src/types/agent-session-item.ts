/** Agent session item schema exposed by Claw Router. */
export interface AgentSessionItem {
  /** Agent id field on agent session item. */
  agentId: string;
  /** Agent version id field on agent session item. */
  agentVersionId?: string | null;
  /** Approval policy field on agent session item. */
  approvalPolicy?: string | null;
  /** Chat conversation id field on agent session item. */
  chatConversationId?: string | null;
  /** Created at field on agent session item. */
  createdAt: string;
  /** Cwd field on agent session item. */
  cwd?: string | null;
  /** Default model field on agent session item. */
  defaultModel?: string | null;
  /** Id field on agent session item. */
  id: string;
  /** Last active at field on agent session item. */
  lastActiveAt?: string | null;
  /** Last run id field on agent session item. */
  lastRunId?: string | null;
  /** Last step id field on agent session item. */
  lastStepId?: number | null;
  /** Memory space id field on agent session item. */
  memorySpaceId?: string | null;
  /** Permission mode field on agent session item. */
  permissionMode?: string | null;
  /** Run count field on agent session item. */
  runCount: number;
  /** Runtime field on agent session item. */
  runtime?: string | null;
  /** Sandbox policy field on agent session item. */
  sandboxPolicy?: string | null;
  /** Session kind field on agent session item. */
  sessionKind: 'chat' | 'coding' | 'interactive' | 'task' | 'background' | 'evaluation';
  /** Source surface field on agent session item. */
  sourceSurface: string;
  /** Status field on agent session item. */
  status: 'active' | 'idle' | 'running' | 'completed' | 'failed' | 'cancelled' | 'archived' | 'deleted';
  /** Step count field on agent session item. */
  stepCount: number;
  /** Title field on agent session item. */
  title: string;
  /** Tool call count field on agent session item. */
  toolCallCount?: number;
  /** Updated at field on agent session item. */
  updatedAt: string;
}

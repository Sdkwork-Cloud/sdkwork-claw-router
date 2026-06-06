import type { JsonValue } from './json-value';

/** Agent session create request schema exposed by Claw Router. */
export interface AgentSessionCreateRequest {
  /** Agent version id field on agent session create request. */
  agentVersionId?: string;
  /** Approval policy field on agent session create request. */
  approvalPolicy?: string;
  /** Chat conversation id field on agent session create request. */
  chatConversationId?: string;
  /** Cwd field on agent session create request. */
  cwd?: string;
  /** Default model field on agent session create request. */
  defaultModel?: string;
  /** Memory space id field on agent session create request. */
  memorySpaceId?: string;
  /** Metadata field on agent session create request. */
  metadata?: Record<string, JsonValue>;
  /** Permission mode field on agent session create request. */
  permissionMode?: string;
  /** Runtime field on agent session create request. */
  runtime?: 'claude_code' | 'gemini' | 'codex' | 'openai' | 'anthropic' | 'custom';
  /** Sandbox policy field on agent session create request. */
  sandboxPolicy?: string;
  /** Session kind field on agent session create request. */
  sessionKind?: 'chat' | 'coding' | 'interactive' | 'task' | 'background' | 'evaluation';
  /** Source surface field on agent session create request. */
  sourceSurface?: string;
  /** Title field on agent session create request. */
  title?: string;
}

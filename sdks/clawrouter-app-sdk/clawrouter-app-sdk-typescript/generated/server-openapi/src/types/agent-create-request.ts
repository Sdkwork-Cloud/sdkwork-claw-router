import type { JsonValue } from './json-value';

/** Agent create request schema exposed by Claw Router. */
export interface AgentCreateRequest {
  /** Code field on agent create request. */
  code?: string;
  /** Description field on agent create request. */
  description?: string;
  /** Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings. */
  mcpPolicy?: Record<string, JsonValue>;
  /** Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings. */
  memoryPolicy?: Record<string, JsonValue>;
  /** Model field on agent create request. */
  model?: string;
  /** Name field on agent create request. */
  name: string;
  /** Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings. */
  runtimePolicy?: Record<string, JsonValue>;
  /** Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings. */
  skillPolicy?: Record<string, JsonValue>;
  /** System prompt field on agent create request. */
  systemPrompt?: string;
  /** Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings. */
  toolPolicy?: Record<string, JsonValue>;
}

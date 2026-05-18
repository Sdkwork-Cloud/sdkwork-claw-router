import type { JsonValue } from './json-value';

/** Admin agent version item schema exposed by Claw Router. */
export interface AdminAgentVersionItem {
  /** Created at field on admin agent version item. */
  createdAt: string;
  /** Id field on admin agent version item. */
  id: string;
  /** Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings. */
  mcpPolicy: Record<string, JsonValue>;
  /** Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings. */
  memoryPolicy: Record<string, JsonValue>;
  /** Model field on admin agent version item. */
  model?: string | null;
  /** Release status field on admin agent version item. */
  releaseStatus: 'draft' | 'published' | 'archived';
  /** Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings. */
  runtimePolicy: Record<string, JsonValue>;
  /** Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings. */
  skillPolicy: Record<string, JsonValue>;
  /** System prompt field on admin agent version item. */
  systemPrompt: string;
  /** Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings. */
  toolPolicy: Record<string, JsonValue>;
  /** Updated at field on admin agent version item. */
  updatedAt: string;
  /** Version no field on admin agent version item. */
  versionNo: number;
}

/** Generation agent run step snapshot schema exposed by Claw Router. */
export interface GenerationAgentRunStepSnapshot {
  /** Id field on generation agent run step snapshot. */
  id: string;
  /** Index field on generation agent run step snapshot. */
  index: number;
  /** Status field on generation agent run step snapshot. */
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'skipped';
  /** Title field on generation agent run step snapshot. */
  title: string;
  /** Type field on generation agent run step snapshot. */
  type: 'input' | 'memory_retrieval' | 'model_call' | 'skill_call' | 'mcp_tool_call' | 'media_generation' | 'metering' | 'output';
}

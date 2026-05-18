/** Generation agent run snapshot schema exposed by Claw Router. */
export interface GenerationAgentRunSnapshot {
  /** Id field on generation agent run snapshot. */
  id: string;
  /** Request id field on generation agent run snapshot. */
  requestId: string;
  /** Source field on generation agent run snapshot. */
  source: 'generation-agent';
  /** Status field on generation agent run snapshot. */
  status: 'queued' | 'planning' | 'running' | 'waiting_for_tool' | 'succeeded' | 'failed' | 'cancelled';
}

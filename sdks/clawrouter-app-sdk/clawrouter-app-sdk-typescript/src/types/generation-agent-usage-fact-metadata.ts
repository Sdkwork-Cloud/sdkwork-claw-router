/** Generation agent usage fact metadata schema exposed by Claw Router. */
export interface GenerationAgentUsageFactMetadata {
  /** Agent id field on generation agent usage fact metadata. */
  agentId: string;
  /** Agent version id field on generation agent usage fact metadata. */
  agentVersionId: string;
  /** Mcp server id field on generation agent usage fact metadata. */
  mcpServerId?: string | null;
  /** Metering source field on generation agent usage fact metadata. */
  meteringSource: 'agent-runtime';
  /** Run id field on generation agent usage fact metadata. */
  runId: string;
  /** Skill id field on generation agent usage fact metadata. */
  skillId?: string | null;
  /** Step id field on generation agent usage fact metadata. */
  stepId: string;
  /** Tool id field on generation agent usage fact metadata. */
  toolId?: string | null;
  /** User id field on generation agent usage fact metadata. */
  userId: string;
}

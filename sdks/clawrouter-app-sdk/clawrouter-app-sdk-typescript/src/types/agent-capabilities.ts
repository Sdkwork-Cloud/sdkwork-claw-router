/** Agent capabilities schema exposed by Claw Router. */
export interface AgentCapabilities {
  /** Mcp server count field on agent capabilities. */
  mcpServerCount: number;
  /** Memory enabled field on agent capabilities. */
  memoryEnabled: boolean;
  /** Skill binding count field on agent capabilities. */
  skillBindingCount: number;
}

/** Commerce category seed initialize request schema exposed by Claw Router. */
export interface CommerceCategorySeedInitializeRequest {
  /** Datasets field on commerce category seed initialize request. */
  datasets?: ('product' | 'courses' | 'agents' | 'agent-skills' | 'mcp' | 'apps')[];
  /** Mode field on commerce category seed initialize request. */
  mode?: string;
}

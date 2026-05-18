/** Generation agent generation config schema exposed by Claw Router. */
export interface GenerationAgentGenerationConfig {
  /** Aspect ratio field on generation agent generation config. */
  aspectRatio?: '1:1' | '16:9' | '9:16';
  /** Duration seconds field on generation agent generation config. */
  durationSeconds?: number;
  /** Image count field on generation agent generation config. */
  imageCount?: number;
  /** Quality field on generation agent generation config. */
  quality?: 'standard' | 'high';
}

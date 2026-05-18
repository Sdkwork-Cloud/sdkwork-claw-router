import type { GenerationAgentMeteringEvent } from './generation-agent-metering-event';

/** Generation agent usage summary schema exposed by Claw Router. */
export interface GenerationAgentUsageSummary {
  /** Cached tokens field on generation agent usage summary. */
  cachedTokens: number;
  /** Completion tokens field on generation agent usage summary. */
  completionTokens: number;
  /** Events field on generation agent usage summary. */
  events: GenerationAgentMeteringEvent[];
  /** Image count field on generation agent usage summary. */
  imageCount: number;
  /** Prompt tokens field on generation agent usage summary. */
  promptTokens: number;
  /** Total tokens field on generation agent usage summary. */
  totalTokens: number;
  /** Video seconds field on generation agent usage summary. */
  videoSeconds: string;
}

import type { GenerationAgentMeteringEvent } from './generation-agent-metering-event';
import type { GenerationAgentRunSnapshot } from './generation-agent-run-snapshot';
import type { GenerationAgentRunStepSnapshot } from './generation-agent-run-step-snapshot';
import type { GenerationAgentSnapshot } from './generation-agent-snapshot';
import type { GenerationAgentUsageSummary } from './generation-agent-usage-summary';
import type { GenerationHistoryItem } from './generation-history-item';

/** Generation agent run create response schema exposed by Claw Router. */
export interface GenerationAgentRunCreateResponse {
  /** Agent field on generation agent run create response. */
  agent: GenerationAgentSnapshot;
  /** Item field on generation agent run create response. */
  item: GenerationHistoryItem;
  /** Metering events field on generation agent run create response. */
  meteringEvents: GenerationAgentMeteringEvent[];
  /** Run field on generation agent run create response. */
  run: GenerationAgentRunSnapshot;
  /** Status field on generation agent run create response. */
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  /** Steps field on generation agent run create response. */
  steps: GenerationAgentRunStepSnapshot[];
  /** Target type field on generation agent run create response. */
  targetType: 'image' | 'video' | 'music' | 'audio' | 'sfx';
  /** Usage field on generation agent run create response. */
  usage: GenerationAgentUsageSummary;
}

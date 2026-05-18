import type { GenerationAgentUsageFactMetadata } from './generation-agent-usage-fact-metadata';

/** Generation agent metering event schema exposed by Claw Router. */
export interface GenerationAgentMeteringEvent {
  /** Quantity field on generation agent metering event. */
  quantity: string;
  /** Type field on generation agent metering event. */
  type: 'token' | 'image' | 'video' | 'audio' | 'tool' | 'mcp' | 'skill' | 'storage' | 'network';
  /** Usage fact metadata field on generation agent metering event. */
  usageFactMetadata: GenerationAgentUsageFactMetadata;
}

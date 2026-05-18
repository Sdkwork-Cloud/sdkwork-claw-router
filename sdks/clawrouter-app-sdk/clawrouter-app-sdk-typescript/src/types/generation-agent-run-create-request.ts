import type { GenerationAgentGenerationConfig } from './generation-agent-generation-config';
import type { GenerationAgentReferenceImageInput } from './generation-agent-reference-image-input';

/** Generation agent run create request schema exposed by Claw Router. */
export interface GenerationAgentRunCreateRequest {
  /** Generation config field on generation agent run create request. */
  generationConfig?: GenerationAgentGenerationConfig;
  /** Prompt field on generation agent run create request. */
  prompt: string;
  /** Reference images field on generation agent run create request. */
  referenceImages?: GenerationAgentReferenceImageInput[];
  /** Selected model field on generation agent run create request. */
  selectedModel?: string;
  /** Target type field on generation agent run create request. */
  targetType?: 'image' | 'video' | 'music' | 'audio' | 'sfx';
}

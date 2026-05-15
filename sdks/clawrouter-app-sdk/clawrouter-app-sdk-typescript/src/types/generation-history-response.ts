import type { GenerationHistoryItem } from './generation-history-item';

/** Generation history response schema exposed by Claw Router. */
export interface GenerationHistoryResponse {
  /** Items field on generation history response. */
  items: GenerationHistoryItem[];
}

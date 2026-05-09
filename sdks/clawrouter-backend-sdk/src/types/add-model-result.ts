import type { AdminAiModelMutationResponse } from './admin-ai-model-mutation-response';

export interface AddModelResult {
  /** Business response code. */
  code: string;
  data?: AdminAiModelMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}

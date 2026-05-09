export interface AdminModelLimitCreateRequest {
  /** Access group or quota group identifier. */
  group: string;
  /** AI model identifier. */
  model: string;
  /** Maximum requests per minute for the model and group. */
  rpm: number;
  status?: 'active' | 'inactive';
  /** Maximum tokens per minute for the model and group. */
  tpm: number;
}

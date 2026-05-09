/** Persisted rate limit rule snapshot returned by the backend. */
export interface AdminRateLimitItem {
  blockDuration?: string;
  burst?: number;
  group?: string;
  id: string;
  keyPrefix?: string;
  model?: string;
  rpd?: number;
  rpm?: number;
  rps?: number;
  ruleName?: string;
  status?: 'active' | 'inactive' | 'exhausted';
  targetIp?: string;
  tpm?: number;
  user?: string;
}

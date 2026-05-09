export interface ProviderRetryPolicy {
  backoffMs?: number;
  maxAttempts: number;
  retryableStatusCodes: (408 | 409 | 425 | 429 | 500 | 502 | 503 | 504)[];
}

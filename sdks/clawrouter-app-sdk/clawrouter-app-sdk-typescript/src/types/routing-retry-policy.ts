/** Routing retry policy schema exposed by Claw Router. */
export interface RoutingRetryPolicy {
  /** Backoff ms field on routing retry policy. */
  backoffMs: number;
  /** Max attempts field on routing retry policy. */
  maxAttempts: number;
  /** Retryable status codes field on routing retry policy. */
  retryableStatusCodes: number[];
}

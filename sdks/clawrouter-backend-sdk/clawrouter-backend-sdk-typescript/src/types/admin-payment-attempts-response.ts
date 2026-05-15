import type { AdminPaymentAttemptItem } from './admin-payment-attempt-item';

/** Admin payment attempts response schema exposed by Claw Router. */
export interface AdminPaymentAttemptsResponse {
  /** Items field on admin payment attempts response. */
  items: AdminPaymentAttemptItem[];
}

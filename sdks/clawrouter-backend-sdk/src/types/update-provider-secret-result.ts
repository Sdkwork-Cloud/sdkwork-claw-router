import type { AdminProviderSecretMutationResponse } from './admin-provider-secret-mutation-response';

export interface UpdateProviderSecretResult {
  /** Business response code. */
  code: string;
  data?: AdminProviderSecretMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}

import type { AdminProviderSecretMutationResponse } from './admin-provider-secret-mutation-response';

export interface AddProviderSecretResult {
  /** Business response code. */
  code: string;
  data?: AdminProviderSecretMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}

import type { AdminDeleteResponse } from './admin-delete-response';

/** Provider secrets delete result schema exposed by Claw Router. */
export interface ProviderSecretsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on provider secrets delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}

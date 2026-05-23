import type { ProvidersResponse } from './providers-response';

/** Providers list result schema exposed by Claw Router. */
export interface ProvidersListResult {
  /** Business response code. */
  code: string;
  /** Data field on providers list result. */
  data?: ProvidersResponse;
  /** Human-readable response message. */
  msg?: string;
}

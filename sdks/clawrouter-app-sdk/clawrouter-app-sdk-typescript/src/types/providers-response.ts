import type { ProviderConfig } from './provider-config';

/** Providers response schema exposed by Claw Router. */
export interface ProvidersResponse {
  /** Items field on providers response. */
  items: ProviderConfig[];
}

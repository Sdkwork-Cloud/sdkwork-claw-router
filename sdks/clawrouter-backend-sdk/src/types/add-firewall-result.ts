import type { AdminFirewallMutationResponse } from './admin-firewall-mutation-response';

export interface AddFirewallResult {
  /** Business response code. */
  code: string;
  data?: AdminFirewallMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}

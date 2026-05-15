import type { CommerceVipBenefitsResponse } from './commerce-vip-benefits-response';

/** Vip benefits list result schema exposed by Claw Router. */
export interface VipBenefitsListResult {
  /** Business response code. */
  code: string;
  /** Data field on vip benefits list result. */
  data?: CommerceVipBenefitsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}

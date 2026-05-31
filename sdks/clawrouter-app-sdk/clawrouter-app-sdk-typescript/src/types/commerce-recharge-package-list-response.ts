import type { CommerceRechargePackageItem } from './commerce-recharge-package-item';

/** Commerce recharge package list response schema exposed by Claw Router. */
export interface CommerceRechargePackageListResponse {
  /** Items field on commerce recharge package list response. */
  items: CommerceRechargePackageItem[];
}

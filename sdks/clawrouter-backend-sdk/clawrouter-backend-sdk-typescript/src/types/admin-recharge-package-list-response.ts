import type { AdminRechargePackageItem } from './admin-recharge-package-item';

/** Admin recharge package list response schema exposed by Claw Router. */
export interface AdminRechargePackageListResponse {
  /** Items field on admin recharge package list response. */
  items: AdminRechargePackageItem[];
}

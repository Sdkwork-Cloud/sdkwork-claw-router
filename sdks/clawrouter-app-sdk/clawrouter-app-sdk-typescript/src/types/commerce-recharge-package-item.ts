/** Commerce recharge package item schema exposed by Claw Router. */
export interface CommerceRechargePackageItem {
  /** Bonus points field on commerce recharge package item. */
  bonusPoints: number;
  /** Currency code field on commerce recharge package item. */
  currencyCode: string;
  /** Grant amount field on commerce recharge package item. */
  grantAmount: number;
  /** Id field on commerce recharge package item. */
  id: string;
  /** Name field on commerce recharge package item. */
  name?: string;
  /** Package no field on commerce recharge package item. */
  packageNo?: string;
  /** Points field on commerce recharge package item. */
  points: number;
  /** Price amount field on commerce recharge package item. */
  priceAmount: string;
  /** Sku id field on commerce recharge package item. */
  skuId?: string;
  /** Status field on commerce recharge package item. */
  status?: string | null;
  /** Updated at field on commerce recharge package item. */
  updatedAt?: string | null;
}

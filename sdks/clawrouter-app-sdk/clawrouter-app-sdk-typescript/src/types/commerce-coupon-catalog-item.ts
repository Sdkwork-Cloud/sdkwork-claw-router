/** Commerce coupon catalog item schema exposed by Claw Router. */
export interface CommerceCouponCatalogItem {
  /** Id field on commerce coupon catalog item. */
  id: string;
  /** Name field on commerce coupon catalog item. */
  name: string;
  /** Status field on commerce coupon catalog item. */
  status: 'active' | 'inactive';
  /** Type field on commerce coupon catalog item. */
  type: 'amount' | 'discount';
  /** Value field on commerce coupon catalog item. */
  value: string;
}

/** Promotion code redemption request schema exposed by Claw Router. */
export interface PromotionCodeRedemptionRequest {
  /** Client request no field on promotion code redemption request. */
  clientRequestNo?: string;
  /** Code field on promotion code redemption request. */
  code: string;
  /** Note field on promotion code redemption request. */
  note?: string;
  /** Scene field on promotion code redemption request. */
  scene?: string;
  /** Source field on promotion code redemption request. */
  source?: string;
}

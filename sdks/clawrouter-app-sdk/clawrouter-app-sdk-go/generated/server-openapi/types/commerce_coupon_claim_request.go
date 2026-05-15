package types

// Commerce coupon claim request schema exposed by Claw Router.
type CommerceCouponClaimRequest struct {
	ClaimSource string `json:"claimSource"`
	CouponId string `json:"couponId"`
}

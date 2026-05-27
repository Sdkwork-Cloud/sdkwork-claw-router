package types

// Promotion user coupon wallet list response schema exposed by Claw Router.
type PromotionUserCouponWalletListResponse struct {
	Items []PromotionCouponWalletItem `json:"items"`
}

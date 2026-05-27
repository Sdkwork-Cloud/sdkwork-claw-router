package types

// Promotions user coupons wallet list result schema exposed by Claw Router.
type PromotionsUserCouponsWalletListResult struct {
	Code string `json:"code"`
	Data PromotionUserCouponWalletListResponse `json:"data"`
	Msg string `json:"msg"`
}

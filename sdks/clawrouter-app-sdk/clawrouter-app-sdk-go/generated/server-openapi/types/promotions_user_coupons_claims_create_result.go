package types

// Promotions user coupons claims create result schema exposed by Claw Router.
type PromotionsUserCouponsClaimsCreateResult struct {
	Code string `json:"code"`
	Data PromotionOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

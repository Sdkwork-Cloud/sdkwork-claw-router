package types

// Promotions discount applications settle result schema exposed by Claw Router.
type PromotionsDiscountApplicationsSettleResult struct {
	Code string `json:"code"`
	Data PromotionOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

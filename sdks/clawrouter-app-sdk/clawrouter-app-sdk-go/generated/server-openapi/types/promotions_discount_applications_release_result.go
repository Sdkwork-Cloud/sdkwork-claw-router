package types

// Promotions discount applications release result schema exposed by Claw Router.
type PromotionsDiscountApplicationsReleaseResult struct {
	Code string `json:"code"`
	Data PromotionOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

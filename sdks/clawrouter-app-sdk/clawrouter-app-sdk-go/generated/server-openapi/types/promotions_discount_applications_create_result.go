package types

// Promotions discount applications create result schema exposed by Claw Router.
type PromotionsDiscountApplicationsCreateResult struct {
	Code string `json:"code"`
	Data PromotionOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

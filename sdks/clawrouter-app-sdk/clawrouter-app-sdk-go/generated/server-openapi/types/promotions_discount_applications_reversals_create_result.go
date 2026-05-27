package types

// Promotions discount applications reversals create result schema exposed by Claw Router.
type PromotionsDiscountApplicationsReversalsCreateResult struct {
	Code string `json:"code"`
	Data PromotionOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

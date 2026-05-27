package types

// Promotions codes redemptions create result schema exposed by Claw Router.
type PromotionsCodesRedemptionsCreateResult struct {
	Code string `json:"code"`
	Data PromotionOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

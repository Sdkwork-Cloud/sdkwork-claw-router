package types

// Promotions codes redemptions list result schema exposed by Claw Router.
type PromotionsCodesRedemptionsListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

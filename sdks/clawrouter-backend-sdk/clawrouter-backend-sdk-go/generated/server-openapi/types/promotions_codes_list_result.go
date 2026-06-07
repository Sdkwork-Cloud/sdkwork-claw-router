package types

// Promotions codes list result schema exposed by Claw Router.
type PromotionsCodesListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

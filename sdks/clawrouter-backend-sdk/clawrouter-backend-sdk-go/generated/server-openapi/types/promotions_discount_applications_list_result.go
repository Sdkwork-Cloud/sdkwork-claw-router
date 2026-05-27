package types

// Promotions discount applications list result schema exposed by Claw Router.
type PromotionsDiscountApplicationsListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

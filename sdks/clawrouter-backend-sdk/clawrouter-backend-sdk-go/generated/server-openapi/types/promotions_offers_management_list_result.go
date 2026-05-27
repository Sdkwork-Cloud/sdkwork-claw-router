package types

// Promotions offers management list result schema exposed by Claw Router.
type PromotionsOffersManagementListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

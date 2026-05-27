package types

// Promotions events list result schema exposed by Claw Router.
type PromotionsEventsListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

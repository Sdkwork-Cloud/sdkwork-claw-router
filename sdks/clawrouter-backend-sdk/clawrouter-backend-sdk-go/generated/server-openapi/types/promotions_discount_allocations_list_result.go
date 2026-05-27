package types

// Promotions discount allocations list result schema exposed by Claw Router.
type PromotionsDiscountAllocationsListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

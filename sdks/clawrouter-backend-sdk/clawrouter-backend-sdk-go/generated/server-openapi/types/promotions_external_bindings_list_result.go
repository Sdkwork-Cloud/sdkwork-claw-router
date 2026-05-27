package types

// Promotions external bindings list result schema exposed by Claw Router.
type PromotionsExternalBindingsListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

package types

// Catalog skus create result schema exposed by Claw Router.
type CatalogSkusCreateResult struct {
	Code string `json:"code"`
	Data CommerceProductSkuMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

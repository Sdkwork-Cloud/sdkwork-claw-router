package types

// Catalog products create result schema exposed by Claw Router.
type CatalogProductsCreateResult struct {
	Code string `json:"code"`
	Data CommerceProductSpuMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

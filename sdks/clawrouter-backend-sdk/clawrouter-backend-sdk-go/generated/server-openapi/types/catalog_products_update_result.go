package types

// Catalog products update result schema exposed by Claw Router.
type CatalogProductsUpdateResult struct {
	Code string `json:"code"`
	Data CommerceProductSpuMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

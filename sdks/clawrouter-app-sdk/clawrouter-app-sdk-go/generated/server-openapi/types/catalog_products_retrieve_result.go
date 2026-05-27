package types

// Catalog products retrieve result schema exposed by Claw Router.
type CatalogProductsRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceProductSpuDetailResponse `json:"data"`
	Msg string `json:"msg"`
}

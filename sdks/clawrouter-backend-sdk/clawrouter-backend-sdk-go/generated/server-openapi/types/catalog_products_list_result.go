package types

// Catalog products list result schema exposed by Claw Router.
type CatalogProductsListResult struct {
	Code string `json:"code"`
	Data CommerceProductSpuListResponse `json:"data"`
	Msg string `json:"msg"`
}

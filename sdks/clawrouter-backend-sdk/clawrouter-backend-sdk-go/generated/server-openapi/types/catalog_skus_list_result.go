package types

// Catalog skus list result schema exposed by Claw Router.
type CatalogSkusListResult struct {
	Code string `json:"code"`
	Data CommerceProductSkuListResponse `json:"data"`
	Msg string `json:"msg"`
}

package types

// Catalog products delete result schema exposed by Claw Router.
type CatalogProductsDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}

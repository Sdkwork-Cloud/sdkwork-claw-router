package types

// Catalog skus delete result schema exposed by Claw Router.
type CatalogSkusDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}

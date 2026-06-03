package types

// Catalog category attributes delete result schema exposed by Claw Router.
type CatalogCategoryAttributesDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}

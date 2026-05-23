package types

// Catalog categories delete result schema exposed by Claw Router.
type CatalogCategoriesDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}

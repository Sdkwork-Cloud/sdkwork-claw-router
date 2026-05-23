package types

// Catalog categories list result schema exposed by Claw Router.
type CatalogCategoriesListResult struct {
	Code string `json:"code"`
	Data CommerceProductCategoryListResponse `json:"data"`
	Msg string `json:"msg"`
}

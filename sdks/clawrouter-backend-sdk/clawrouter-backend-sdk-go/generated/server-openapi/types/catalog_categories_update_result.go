package types

// Catalog categories update result schema exposed by Claw Router.
type CatalogCategoriesUpdateResult struct {
	Code string `json:"code"`
	Data CommerceProductCategoryMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

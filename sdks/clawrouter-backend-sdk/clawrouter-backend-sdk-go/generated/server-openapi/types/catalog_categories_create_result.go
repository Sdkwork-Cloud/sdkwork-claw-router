package types

// Catalog categories create result schema exposed by Claw Router.
type CatalogCategoriesCreateResult struct {
	Code string `json:"code"`
	Data CommerceProductCategoryMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

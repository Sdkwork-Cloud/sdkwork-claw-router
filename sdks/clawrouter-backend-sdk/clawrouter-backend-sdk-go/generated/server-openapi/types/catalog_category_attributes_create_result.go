package types

// Catalog category attributes create result schema exposed by Claw Router.
type CatalogCategoryAttributesCreateResult struct {
	Code string `json:"code"`
	Data CommerceProductCategoryAttributeMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

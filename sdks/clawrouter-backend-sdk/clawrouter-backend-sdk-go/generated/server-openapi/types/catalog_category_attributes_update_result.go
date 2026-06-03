package types

// Catalog category attributes update result schema exposed by Claw Router.
type CatalogCategoryAttributesUpdateResult struct {
	Code string `json:"code"`
	Data CommerceProductCategoryAttributeMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

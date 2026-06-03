package types

// Catalog category attributes list result schema exposed by Claw Router.
type CatalogCategoryAttributesListResult struct {
	Code string `json:"code"`
	Data CommerceProductCategoryAttributeListResponse `json:"data"`
	Msg string `json:"msg"`
}

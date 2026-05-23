package types

// Catalog attributes list result schema exposed by Claw Router.
type CatalogAttributesListResult struct {
	Code string `json:"code"`
	Data CommerceProductAttributeListResponse `json:"data"`
	Msg string `json:"msg"`
}

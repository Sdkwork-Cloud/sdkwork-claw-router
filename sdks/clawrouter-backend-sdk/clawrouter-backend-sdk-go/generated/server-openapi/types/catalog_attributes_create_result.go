package types

// Catalog attributes create result schema exposed by Claw Router.
type CatalogAttributesCreateResult struct {
	Code string `json:"code"`
	Data CommerceProductAttributeMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

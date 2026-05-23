package types

// Catalog skus update result schema exposed by Claw Router.
type CatalogSkusUpdateResult struct {
	Code string `json:"code"`
	Data CommerceProductSkuMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

package types

// Catalog skus retrieve result schema exposed by Claw Router.
type CatalogSkusRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceProductSkuResponse `json:"data"`
	Msg string `json:"msg"`
}

package types

// App model catalog response schema exposed by Claw Router.
type AppModelCatalogResponse struct {
	Items []AppModelCatalogItem `json:"items"`
}

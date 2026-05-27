package types

// App model catalog response schema exposed by Claw Router.
type AppModelCatalogResponse struct {
	Groups []AppModelCatalogGroupOption `json:"groups"`
	Items []AppModelCatalogItem `json:"items"`
}

package types

// App catalog response schema exposed by Claw Router.
type AppCatalogResponse struct {
	Items []AppCatalogItem `json:"items"`
}

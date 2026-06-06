package types

// App catalog response schema exposed by Claw Router.
type AppCatalogResponse struct {
	HasNextPage bool `json:"hasNextPage"`
	Items []AppCatalogItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total string `json:"total"`
}

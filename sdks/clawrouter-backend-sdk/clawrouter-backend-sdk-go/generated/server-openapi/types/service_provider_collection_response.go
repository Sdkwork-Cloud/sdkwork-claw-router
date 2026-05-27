package types

// Service provider collection response schema exposed by Claw Router.
type ServiceProviderCollectionResponse struct {
	Items []map[string]JsonValue `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

package types

// Messaging collection response schema exposed by Claw Router.
type MessagingCollectionResponse struct {
	Items []map[string]JsonValue `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

package types

// Promotion collection response schema exposed by Claw Router.
type PromotionCollectionResponse struct {
	Items []map[string]interface{} `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

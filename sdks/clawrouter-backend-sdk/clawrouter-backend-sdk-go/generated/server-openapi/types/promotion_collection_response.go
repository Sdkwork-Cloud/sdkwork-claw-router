package types

// Promotion collection response schema exposed by Claw Router.
type PromotionCollectionResponse struct {
	Items []map[string]interface{} `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}

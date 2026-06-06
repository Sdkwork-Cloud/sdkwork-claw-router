package types

// Commerce standard collection response schema exposed by Claw Router.
type CommerceStandardCollectionResponse struct {
	Items []map[string]interface{} `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}

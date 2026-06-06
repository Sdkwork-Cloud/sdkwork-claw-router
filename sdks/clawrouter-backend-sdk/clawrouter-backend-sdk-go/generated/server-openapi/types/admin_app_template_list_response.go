package types

// Admin app template list response schema exposed by Claw Router.
type AdminAppTemplateListResponse struct {
	HasNextPage bool `json:"hasNextPage"`
	Items []AdminAppTemplateItemResponse `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}

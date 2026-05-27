package types

// Admin app template list response schema exposed by Claw Router.
type AdminAppTemplateListResponse struct {
	HasNextPage bool `json:"hasNextPage"`
	Items []AdminAppTemplateItemResponse `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

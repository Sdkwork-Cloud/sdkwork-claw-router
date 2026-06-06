package types

// Admin app list response schema exposed by Claw Router.
type AdminAppListResponse struct {
	HasNextPage bool `json:"hasNextPage"`
	Items []AdminAppItemResponse `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}

package types

// Admin app list response schema exposed by Claw Router.
type AdminAppListResponse struct {
	HasNextPage bool `json:"hasNextPage"`
	Items []AdminAppItemResponse `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

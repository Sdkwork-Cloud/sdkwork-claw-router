package types

// Commerce product category list response schema exposed by Claw Router.
type CommerceProductCategoryListResponse struct {
	Items []CommerceProductCategoryItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

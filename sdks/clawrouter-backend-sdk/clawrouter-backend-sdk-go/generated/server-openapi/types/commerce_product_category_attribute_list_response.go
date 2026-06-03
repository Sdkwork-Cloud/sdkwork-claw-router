package types

// Commerce product category attribute list response schema exposed by Claw Router.
type CommerceProductCategoryAttributeListResponse struct {
	Items []CommerceProductCategoryAttributeItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

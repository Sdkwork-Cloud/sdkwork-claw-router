package types

// Commerce product category attribute list response schema exposed by Claw Router.
type CommerceProductCategoryAttributeListResponse struct {
	Items []CommerceProductCategoryAttributeItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}

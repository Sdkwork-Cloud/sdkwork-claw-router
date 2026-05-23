package types

// Commerce product attribute list response schema exposed by Claw Router.
type CommerceProductAttributeListResponse struct {
	Items []CommerceProductAttributeItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

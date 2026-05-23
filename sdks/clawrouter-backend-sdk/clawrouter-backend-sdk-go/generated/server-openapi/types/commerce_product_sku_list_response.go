package types

// Commerce product sku list response schema exposed by Claw Router.
type CommerceProductSkuListResponse struct {
	Items []CommerceProductSkuItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

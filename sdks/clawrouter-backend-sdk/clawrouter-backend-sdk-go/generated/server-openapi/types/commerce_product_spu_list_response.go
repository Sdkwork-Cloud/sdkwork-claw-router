package types

// Commerce product spu list response schema exposed by Claw Router.
type CommerceProductSpuListResponse struct {
	Items []CommerceProductSpuItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

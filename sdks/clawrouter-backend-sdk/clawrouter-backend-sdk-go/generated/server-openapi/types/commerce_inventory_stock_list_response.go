package types

// Commerce inventory stock list response schema exposed by Claw Router.
type CommerceInventoryStockListResponse struct {
	Items []CommerceInventoryStockItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

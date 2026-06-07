package types

// Commerce inventory stock list response schema exposed by Claw Router.
type CommerceInventoryStockListResponse struct {
	Items []CommerceInventoryStockItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}

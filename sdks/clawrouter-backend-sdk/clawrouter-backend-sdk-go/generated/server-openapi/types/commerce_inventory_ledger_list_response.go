package types

// Commerce inventory ledger list response schema exposed by Claw Router.
type CommerceInventoryLedgerListResponse struct {
	Items []CommerceInventoryLedgerItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

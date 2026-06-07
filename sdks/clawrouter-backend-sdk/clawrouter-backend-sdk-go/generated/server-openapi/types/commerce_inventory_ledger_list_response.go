package types

// Commerce inventory ledger list response schema exposed by Claw Router.
type CommerceInventoryLedgerListResponse struct {
	Items []CommerceInventoryLedgerItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}

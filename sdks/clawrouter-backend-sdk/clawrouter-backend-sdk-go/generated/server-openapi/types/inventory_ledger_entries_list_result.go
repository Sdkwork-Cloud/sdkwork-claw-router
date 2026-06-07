package types

// Inventory ledger entries list result schema exposed by Claw Router.
type InventoryLedgerEntriesListResult struct {
	Code string `json:"code"`
	Data CommerceInventoryLedgerListResponse `json:"data"`
	Msg string `json:"msg"`
}

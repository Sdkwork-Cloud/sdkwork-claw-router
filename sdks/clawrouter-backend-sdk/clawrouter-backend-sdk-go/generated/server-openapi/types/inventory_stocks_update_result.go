package types

// Inventory stocks update result schema exposed by Claw Router.
type InventoryStocksUpdateResult struct {
	Code string `json:"code"`
	Data CommerceInventoryStockMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

package types

// Inventory stocks list result schema exposed by Claw Router.
type InventoryStocksListResult struct {
	Code string `json:"code"`
	Data CommerceInventoryStockListResponse `json:"data"`
	Msg string `json:"msg"`
}

package types

// Commerce inventory ledger item schema exposed by Claw Router.
type CommerceInventoryLedgerItem struct {
	BalanceAfter string `json:"balanceAfter"`
	BusinessType string `json:"businessType"`
	CreatedAt string `json:"createdAt"`
	Direction string `json:"direction"`
	Id string `json:"id"`
	MovementNo string `json:"movementNo"`
	Quantity string `json:"quantity"`
	SkuId string `json:"skuId"`
	SourceId string `json:"sourceId"`
	SourceType string `json:"sourceType"`
	WarehouseId string `json:"warehouseId"`
}

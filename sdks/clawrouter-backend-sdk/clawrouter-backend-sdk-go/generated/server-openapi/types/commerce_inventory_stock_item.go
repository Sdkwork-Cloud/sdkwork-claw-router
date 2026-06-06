package types

// Commerce inventory stock item schema exposed by Claw Router.
type CommerceInventoryStockItem struct {
	AvailableQuantity string `json:"availableQuantity"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	ReservedQuantity string `json:"reservedQuantity"`
	SkuId string `json:"skuId"`
	SoldQuantity string `json:"soldQuantity"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
	Version string `json:"version"`
	WarehouseId string `json:"warehouseId"`
}

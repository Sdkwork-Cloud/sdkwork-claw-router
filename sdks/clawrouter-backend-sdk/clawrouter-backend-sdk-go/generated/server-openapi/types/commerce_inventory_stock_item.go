package types

// Commerce inventory stock item schema exposed by Claw Router.
type CommerceInventoryStockItem struct {
	AvailableQuantity int `json:"availableQuantity"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	ReservedQuantity int `json:"reservedQuantity"`
	SkuId string `json:"skuId"`
	SoldQuantity int `json:"soldQuantity"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
	Version int `json:"version"`
	WarehouseId string `json:"warehouseId"`
}

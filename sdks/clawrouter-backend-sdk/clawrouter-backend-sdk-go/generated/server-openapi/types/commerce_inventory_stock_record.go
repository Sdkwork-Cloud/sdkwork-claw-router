package types

// Commerce inventory stock record schema exposed by Claw Router.
type CommerceInventoryStockRecord struct {
	AvailableQuantity string `json:"available_quantity"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	ReservedQuantity string `json:"reserved_quantity"`
	SkuId string `json:"sku_id"`
	SoldQuantity string `json:"sold_quantity"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Version string `json:"version"`
	WarehouseId string `json:"warehouse_id"`
}

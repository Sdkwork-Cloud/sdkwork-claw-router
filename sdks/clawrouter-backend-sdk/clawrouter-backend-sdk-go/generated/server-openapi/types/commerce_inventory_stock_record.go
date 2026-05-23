package types

// Commerce inventory stock record schema exposed by Claw Router.
type CommerceInventoryStockRecord struct {
	CreatedAt string `json:"created_at"`
	OrganizationId string `json:"organization_id"`
	SkuId string `json:"sku_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	WarehouseId string `json:"warehouse_id"`
}

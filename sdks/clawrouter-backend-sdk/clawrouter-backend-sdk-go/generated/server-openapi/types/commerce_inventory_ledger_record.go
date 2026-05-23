package types

// Commerce inventory ledger record schema exposed by Claw Router.
type CommerceInventoryLedgerRecord struct {
	BusinessType string `json:"business_type"`
	CreatedAt string `json:"created_at"`
	Direction string `json:"direction"`
	IdempotencyKey string `json:"idempotency_key"`
	MovementNo string `json:"movement_no"`
	OrganizationId string `json:"organization_id"`
	SkuId string `json:"sku_id"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	TenantId string `json:"tenant_id"`
	WarehouseId string `json:"warehouse_id"`
}

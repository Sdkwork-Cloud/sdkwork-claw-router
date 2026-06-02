package types

// Commerce fulfillment order record schema exposed by Claw Router.
type CommerceFulfillmentOrderRecord struct {
	AddressSnapshotId string `json:"address_snapshot_id"`
	CompletedAt string `json:"completed_at"`
	CreatedAt string `json:"created_at"`
	FulfillmentNo string `json:"fulfillment_no"`
	FulfillmentType string `json:"fulfillment_type"`
	Id string `json:"id"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	ProviderCode string `json:"provider_code"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	WarehouseId string `json:"warehouse_id"`
}

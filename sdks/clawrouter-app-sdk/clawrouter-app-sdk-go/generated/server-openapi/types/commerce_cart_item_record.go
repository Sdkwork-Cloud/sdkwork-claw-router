package types

// Commerce cart item record schema exposed by Claw Router.
type CommerceCartItemRecord struct {
	CartId string `json:"cart_id"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	MetadataJson map[string]JsonValue `json:"metadata_json"`
	OrganizationId string `json:"organization_id"`
	PriceSnapshotJson map[string]JsonValue `json:"price_snapshot_json"`
	Quantity string `json:"quantity"`
	Selected bool `json:"selected"`
	SkuId string `json:"sku_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}

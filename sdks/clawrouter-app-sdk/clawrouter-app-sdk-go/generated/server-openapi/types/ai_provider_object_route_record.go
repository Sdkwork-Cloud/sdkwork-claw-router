package types

// Ai provider object route record schema exposed by Claw Router.
type AiProviderObjectRouteRecord struct {
	ApiCode string `json:"api_code"`
	ApiKeyId string `json:"api_key_id"`
	CatalogKey string `json:"catalog_key"`
	ChannelGroupId string `json:"channel_group_id"`
	ChannelId string `json:"channel_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EndpointId string `json:"endpoint_id"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	LastSeenAt string `json:"last_seen_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	ObjectId string `json:"object_id"`
	ObjectKeyHash string `json:"object_key_hash"`
	ObjectType string `json:"object_type"`
	OrganizationId string `json:"organization_id"`
	ParentObjectId string `json:"parent_object_id"`
	ParentObjectType string `json:"parent_object_type"`
	ProviderCode string `json:"provider_code"`
	ProviderModel string `json:"provider_model"`
	RegionCode string `json:"region_code"`
	Status string `json:"status"`
	StickyScope string `json:"sticky_scope"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	Version string `json:"version"`
}

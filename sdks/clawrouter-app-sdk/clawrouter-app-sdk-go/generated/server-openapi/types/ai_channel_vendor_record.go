package types

// Ai channel vendor record schema exposed by Claw Router.
type AiChannelVendorRecord struct {
	ChannelCode string `json:"channel_code"`
	ChannelId string `json:"channel_id"`
	ChannelType string `json:"channel_type"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderCode string `json:"provider_code"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	Supported bool `json:"supported"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	VendorId string `json:"vendor_id"`
	Version string `json:"version"`
}

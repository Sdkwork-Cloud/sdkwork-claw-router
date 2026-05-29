package types

// Ai route candidate record schema exposed by Claw Router.
type AiRouteCandidateRecord struct {
	ApiCode string `json:"api_code"`
	CatalogKey string `json:"catalog_key"`
	ChannelGroupId string `json:"channel_group_id"`
	ChannelId string `json:"channel_id"`
	ChannelType string `json:"channel_type"`
	ConfigVersion string `json:"config_version"`
	CreatedAt string `json:"created_at"`
	EndpointId string `json:"endpoint_id"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	ModelCode string `json:"model_code"`
	OrganizationId string `json:"organization_id"`
	Priority int `json:"priority"`
	ProviderCode string `json:"provider_code"`
	RebuildVersion string `json:"rebuild_version"`
	RefreshedAt string `json:"refreshed_at"`
	RegionCode string `json:"region_code"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	Weight int `json:"weight"`
}

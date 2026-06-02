package types

// Ai channel endpoint record schema exposed by Claw Router.
type AiChannelEndpointRecord struct {
	ApiCode string `json:"api_code"`
	ApiEndpointId string `json:"api_endpoint_id"`
	BaseUrl string `json:"base_url"`
	ChannelCode string `json:"channel_code"`
	ChannelId string `json:"channel_id"`
	ChannelType string `json:"channel_type"`
	ConsecutiveErrorCount string `json:"consecutive_error_count"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	LastLatencyMs int `json:"last_latency_ms"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PathPrefix string `json:"path_prefix"`
	Priority int `json:"priority"`
	ProviderCode string `json:"provider_code"`
	RegionCode string `json:"region_code"`
	RetryPolicy map[string]JsonValue `json:"retry_policy"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TimeoutMs int `json:"timeout_ms"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	VendorId string `json:"vendor_id"`
	Version string `json:"version"`
	Weight int `json:"weight"`
}

package types

// Ai site model record schema exposed by Claw Router.
type AiSiteModelRecord struct {
	Capabilities map[string]JsonValue `json:"capabilities"`
	Capability string `json:"capability"`
	CatalogKey string `json:"catalog_key"`
	ConsecutiveErrorCount string `json:"consecutive_error_count"`
	ContextTokens string `json:"context_tokens"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultParameters map[string]JsonValue `json:"default_parameters"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DisplayName string `json:"display_name"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	LastLatencyMs int `json:"last_latency_ms"`
	LastSyncAt string `json:"last_sync_at"`
	MaxInputTokens string `json:"max_input_tokens"`
	MaxOutputTokens string `json:"max_output_tokens"`
	Metadata map[string]JsonValue `json:"metadata"`
	Modality string `json:"modality"`
	ModelAliases map[string]JsonValue `json:"model_aliases"`
	ModelCode string `json:"model_code"`
	ModelId string `json:"model_id"`
	ModelName string `json:"model_name"`
	OrganizationId string `json:"organization_id"`
	PricingSnapshot map[string]JsonValue `json:"pricing_snapshot"`
	ProviderModel string `json:"provider_model"`
	ProviderNativeModel string `json:"provider_native_model"`
	ServiceType string `json:"service_type"`
	SiteCode string `json:"site_code"`
	SiteId string `json:"site_id"`
	SiteServiceCode string `json:"site_service_code"`
	SiteServiceId string `json:"site_service_id"`
	Status string `json:"status"`
	SupportsJsonSchema bool `json:"supports_json_schema"`
	SupportsStreaming bool `json:"supports_streaming"`
	SupportsTools bool `json:"supports_tools"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	Version string `json:"version"`
}

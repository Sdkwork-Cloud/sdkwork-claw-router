package types

// Ai channel model record schema exposed by Claw Router.
type AiChannelModelRecord struct {
	ApiCode string `json:"api_code"`
	Capability string `json:"capability"`
	CatalogKey string `json:"catalog_key"`
	ChannelId string `json:"channel_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultParameters map[string]JsonValue `json:"default_parameters"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	MaxInputTokens string `json:"max_input_tokens"`
	MaxOutputTokens string `json:"max_output_tokens"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	ModelAliases map[string]JsonValue `json:"model_aliases"`
	ModelId string `json:"model_id"`
	OrganizationId string `json:"organization_id"`
	ProviderModel string `json:"provider_model"`
	ProviderNativeModel string `json:"provider_native_model"`
	Status string `json:"status"`
	SupportsStreaming bool `json:"supports_streaming"`
	SupportsTools bool `json:"supports_tools"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	Version string `json:"version"`
}

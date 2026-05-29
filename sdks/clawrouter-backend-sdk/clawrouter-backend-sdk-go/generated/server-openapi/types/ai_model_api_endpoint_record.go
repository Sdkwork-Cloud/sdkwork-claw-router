package types

// Ai model api endpoint record schema exposed by Claw Router.
type AiModelApiEndpointRecord struct {
	ApiEndpointId string `json:"api_endpoint_id"`
	CatalogKey string `json:"catalog_key"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultParameters map[string]JsonValue `json:"default_parameters"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EndpointCode string `json:"endpoint_code"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	ModelId string `json:"model_id"`
	OrganizationId string `json:"organization_id"`
	ProviderNativeModel string `json:"provider_native_model"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	Supported bool `json:"supported"`
	SupportsStreaming bool `json:"supports_streaming"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	Version string `json:"version"`
}

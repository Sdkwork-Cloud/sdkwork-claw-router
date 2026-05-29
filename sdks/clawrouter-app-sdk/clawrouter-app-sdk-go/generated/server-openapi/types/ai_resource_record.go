package types

// Ai resource record schema exposed by Claw Router.
type AiResourceRecord struct {
	ApiCode string `json:"api_code"`
	ApiEndpointId string `json:"api_endpoint_id"`
	CatalogKey string `json:"catalog_key"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DisplayName string `json:"display_name"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MetadataSchema map[string]JsonValue `json:"metadata_schema"`
	ModalityCode string `json:"modality_code"`
	ModalityId string `json:"modality_id"`
	Model string `json:"model"`
	ModelCode string `json:"model_code"`
	ModelId string `json:"model_id"`
	OrganizationId string `json:"organization_id"`
	ProviderNativeModel string `json:"provider_native_model"`
	ResourceCode string `json:"resource_code"`
	ResourceSchema map[string]JsonValue `json:"resource_schema"`
	ResourceType string `json:"resource_type"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	VendorId string `json:"vendor_id"`
	Version string `json:"version"`
}

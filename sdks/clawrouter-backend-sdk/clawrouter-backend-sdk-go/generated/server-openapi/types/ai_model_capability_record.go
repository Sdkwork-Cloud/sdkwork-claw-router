package types

// Ai model capability record schema exposed by Claw Router.
type AiModelCapabilityRecord struct {
	Capability string `json:"capability"`
	CapabilityCode string `json:"capability_code"`
	CatalogKey string `json:"catalog_key"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	EndpointFormats map[string]JsonValue `json:"endpoint_formats"`
	Id string `json:"id"`
	InputModalities map[string]JsonValue `json:"input_modalities"`
	LimitUnit string `json:"limit_unit"`
	LimitValue string `json:"limit_value"`
	Metadata map[string]JsonValue `json:"metadata"`
	Modality string `json:"modality"`
	Model string `json:"model"`
	ModelId string `json:"model_id"`
	OrganizationId string `json:"organization_id"`
	OutputModalities map[string]JsonValue `json:"output_modalities"`
	ParameterName string `json:"parameter_name"`
	ParameterSchema map[string]JsonValue `json:"parameter_schema"`
	SchemaVersion string `json:"schema_version"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	Supported bool `json:"supported"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	Version string `json:"version"`
}

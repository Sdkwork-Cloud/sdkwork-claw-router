package types

// Ai model modality record schema exposed by Claw Router.
type AiModelModalityRecord struct {
	CatalogKey string `json:"catalog_key"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Direction string `json:"direction"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	ModalityCode string `json:"modality_code"`
	ModalityId string `json:"modality_id"`
	Model string `json:"model"`
	ModelId string `json:"model_id"`
	OrganizationId string `json:"organization_id"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	Supported bool `json:"supported"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	Version string `json:"version"`
}

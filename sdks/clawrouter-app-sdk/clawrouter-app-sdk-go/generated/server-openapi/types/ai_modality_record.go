package types

// Ai modality record schema exposed by Claw Router.
type AiModalityRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DisplayName string `json:"display_name"`
	Id string `json:"id"`
	InputSupported bool `json:"input_supported"`
	Metadata map[string]JsonValue `json:"metadata"`
	ModalityCode string `json:"modality_code"`
	ModalityGroup string `json:"modality_group"`
	OrganizationId string `json:"organization_id"`
	OutputSupported bool `json:"output_supported"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

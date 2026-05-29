package types

// Ai model family record schema exposed by Claw Router.
type AiModelFamilyRecord struct {
	ColorToken string `json:"color_token"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultModel string `json:"default_model"`
	DefaultModelId string `json:"default_model_id"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DisplayName string `json:"display_name"`
	DocsUrl string `json:"docs_url"`
	FamilyCode string `json:"family_code"`
	FamilyType string `json:"family_type"`
	IconUrl string `json:"icon_url"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	ModelCount string `json:"model_count"`
	OrganizationId string `json:"organization_id"`
	PrimaryModality string `json:"primary_modality"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	VendorId string `json:"vendor_id"`
	Version string `json:"version"`
}

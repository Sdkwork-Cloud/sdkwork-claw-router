package types

// Ai generation session record schema exposed by Claw Router.
type AiGenerationSessionRecord struct {
	ActiveModality string `json:"active_modality"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	FilterConfig map[string]JsonValue `json:"filter_config"`
	Id string `json:"id"`
	LastOpenedAt string `json:"last_opened_at"`
	LastPrompt string `json:"last_prompt"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	SelectedModels map[string]JsonValue `json:"selected_models"`
	SessionCode string `json:"session_code"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

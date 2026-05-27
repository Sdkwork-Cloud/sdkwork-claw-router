package types

// Iam verification scene policy record schema exposed by Claw Router.
type IamVerificationScenePolicyRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultChannel string `json:"default_channel"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	SceneName string `json:"scene_name"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

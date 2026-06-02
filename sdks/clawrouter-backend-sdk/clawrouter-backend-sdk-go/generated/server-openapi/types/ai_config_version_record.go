package types

// Ai config version record schema exposed by Claw Router.
type AiConfigVersionRecord struct {
	ChangedObjectId string `json:"changed_object_id"`
	ChangedObjectType string `json:"changed_object_type"`
	ConfigScope string `json:"config_scope"`
	ConfigVersion string `json:"config_version"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

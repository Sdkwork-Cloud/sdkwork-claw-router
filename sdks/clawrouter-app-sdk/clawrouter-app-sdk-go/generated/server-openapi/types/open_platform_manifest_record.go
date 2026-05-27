package types

// Open platform manifest record schema exposed by Claw Router.
type OpenPlatformManifestRecord struct {
	AccountType string `json:"account_type"`
	CallbackSchema map[string]JsonValue `json:"callback_schema"`
	CapabilitySchema map[string]JsonValue `json:"capability_schema"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EntrySchema map[string]JsonValue `json:"entry_schema"`
	Id string `json:"id"`
	ManifestKey string `json:"manifest_key"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Provider string `json:"provider"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

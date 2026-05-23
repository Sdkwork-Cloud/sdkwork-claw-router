package types

// Open platform entry record schema exposed by Claw Router.
type OpenPlatformEntryRecord struct {
	AccountId string `json:"account_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EntryKey string `json:"entry_key"`
	EntryType string `json:"entry_type"`
	EntryUrl string `json:"entry_url"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

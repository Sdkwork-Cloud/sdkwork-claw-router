package types

// Open platform account record schema exposed by Claw Router.
type OpenPlatformAccountRecord struct {
	AccountKey string `json:"account_key"`
	AccountType string `json:"account_type"`
	AesKeyRef string `json:"aes_key_ref"`
	AppId string `json:"app_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultEntryId string `json:"default_entry_id"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	Provider string `json:"provider"`
	QrDefault bool `json:"qr_default"`
	SecretRef string `json:"secret_ref"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TokenRef string `json:"token_ref"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

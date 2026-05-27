package types

// Messaging template binding record schema exposed by Claw Router.
type MessagingTemplateBindingRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	LastSyncedAt string `json:"last_synced_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderTemplateVersion string `json:"provider_template_version"`
	RejectionReason string `json:"rejection_reason"`
	Status string `json:"status"`
	SyncPayloadHash string `json:"sync_payload_hash"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

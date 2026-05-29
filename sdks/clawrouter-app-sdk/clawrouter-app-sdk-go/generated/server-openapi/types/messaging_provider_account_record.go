package types

// Messaging provider account record schema exposed by Claw Router.
type MessagingProviderAccountRecord struct {
	AuthType string `json:"auth_type"`
	BaseUrl string `json:"base_url"`
	CreatedAt string `json:"created_at"`
	CredentialHash string `json:"credential_hash"`
	CredentialRef string `json:"credential_ref"`
	CredentialVersion string `json:"credential_version"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeliveryPurpose string `json:"delivery_purpose"`
	Id string `json:"id"`
	LastUsedAt string `json:"last_used_at"`
	LastVerifiedAt string `json:"last_verified_at"`
	MaskedLabel string `json:"masked_label"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderId string `json:"provider_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

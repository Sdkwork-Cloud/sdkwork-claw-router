package types

// Object provider record schema exposed by Claw Router.
type ObjectProviderRecord struct {
	CreatedAt string `json:"created_at"`
	CredentialRef string `json:"credential_ref"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EndpointUrl string `json:"endpoint_url"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	LastHealthCheckAt string `json:"last_health_check_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderCode string `json:"provider_code"`
	ProviderType string `json:"provider_type"`
	Region string `json:"region"`
	RequestId string `json:"request_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

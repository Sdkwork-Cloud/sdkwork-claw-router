package types

// Integration proxy record schema exposed by Claw Router.
type IntegrationProxyRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	Endpoint string `json:"endpoint"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	LastCheckedAt string `json:"last_checked_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProxyCode string `json:"proxy_code"`
	ProxyType string `json:"proxy_type"`
	Region string `json:"region"`
	SecretHash string `json:"secret_hash"`
	SecretRef string `json:"secret_ref"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

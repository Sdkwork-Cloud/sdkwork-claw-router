package types

// Integration provider account record schema exposed by Claw Router.
type IntegrationProviderAccountRecord struct {
	AccountCode string `json:"account_code"`
	AccountName string `json:"account_name"`
	AccountType string `json:"account_type"`
	AuthConfig map[string]JsonValue `json:"auth_config"`
	AuthType string `json:"auth_type"`
	BaseUrl string `json:"base_url"`
	ChannelType string `json:"channel_type"`
	ConsecutiveErrorCount string `json:"consecutive_error_count"`
	CreatedAt string `json:"created_at"`
	CredentialProfile string `json:"credential_profile"`
	CredentialVersion string `json:"credential_version"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Environment string `json:"environment"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	LastLatencyMs int `json:"last_latency_ms"`
	LastRotatedAt string `json:"last_rotated_at"`
	LastUsedAt string `json:"last_used_at"`
	LastVerifiedAt string `json:"last_verified_at"`
	MaskedLabel string `json:"masked_label"`
	Metadata map[string]JsonValue `json:"metadata"`
	NextRotateAt string `json:"next_rotate_at"`
	OrganizationId string `json:"organization_id"`
	ProviderCode string `json:"provider_code"`
	ProviderId string `json:"provider_id"`
	QuotaSnapshot map[string]JsonValue `json:"quota_snapshot"`
	RegionCode string `json:"region_code"`
	RiskLevel string `json:"risk_level"`
	SecretHash string `json:"secret_hash"`
	SecretRef string `json:"secret_ref"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

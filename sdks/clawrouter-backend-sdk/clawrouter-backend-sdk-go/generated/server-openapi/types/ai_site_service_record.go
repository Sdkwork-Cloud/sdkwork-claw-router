package types

// Ai site service record schema exposed by Claw Router.
type AiSiteServiceRecord struct {
	AuthConfig map[string]JsonValue `json:"auth_config"`
	AuthType string `json:"auth_type"`
	BaseUrl string `json:"base_url"`
	ConsecutiveErrorCount string `json:"consecutive_error_count"`
	CreatedAt string `json:"created_at"`
	CredentialHash string `json:"credential_hash"`
	CredentialProfile string `json:"credential_profile"`
	CredentialRef string `json:"credential_ref"`
	CredentialVersion string `json:"credential_version"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Environment string `json:"environment"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	LastLatencyMs int `json:"last_latency_ms"`
	LastSyncAt string `json:"last_sync_at"`
	LastVerifiedAt string `json:"last_verified_at"`
	MaskedLabel string `json:"masked_label"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProtocolCode string `json:"protocol_code"`
	RegionCode string `json:"region_code"`
	ServiceCode string `json:"service_code"`
	ServiceName string `json:"service_name"`
	ServiceType string `json:"service_type"`
	SiteCode string `json:"site_code"`
	SiteId string `json:"site_id"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

package types

// Integration provider account record schema exposed by Claw Router.
type IntegrationProviderAccountRecord struct {
	AccountCode string `json:"account_code"`
	AccountName string `json:"account_name"`
	AuthConfig map[string]JsonValue `json:"auth_config"`
	AuthType string `json:"auth_type"`
	BaseUrl string `json:"base_url"`
	ConsecutiveErrorCount string `json:"consecutive_error_count"`
	CreatedAt string `json:"created_at"`
	CredentialProfile string `json:"credential_profile"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	ExternalAccountId string `json:"external_account_id"`
	Id string `json:"id"`
	LastBalanceCheckedAt string `json:"last_balance_checked_at"`
	LastRotatedAt string `json:"last_rotated_at"`
	LastUsedAt string `json:"last_used_at"`
	LastVerifiedAt string `json:"last_verified_at"`
	MaskedLabel string `json:"masked_label"`
	Metadata map[string]JsonValue `json:"metadata"`
	NextRotateAt string `json:"next_rotate_at"`
	OrganizationId string `json:"organization_id"`
	ProviderCode string `json:"provider_code"`
	ProviderId string `json:"provider_id"`
	QuotaLimit string `json:"quota_limit"`
	QuotaUnit string `json:"quota_unit"`
	QuotaUsed string `json:"quota_used"`
	RiskLevel string `json:"risk_level"`
	SecretHash string `json:"secret_hash"`
	SecretRef string `json:"secret_ref"`
	SecretRotationPolicy map[string]JsonValue `json:"secret_rotation_policy"`
	SecretVersion string `json:"secret_version"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UpstreamBalanceAmount string `json:"upstream_balance_amount"`
	UpstreamBalanceCurrency string `json:"upstream_balance_currency"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

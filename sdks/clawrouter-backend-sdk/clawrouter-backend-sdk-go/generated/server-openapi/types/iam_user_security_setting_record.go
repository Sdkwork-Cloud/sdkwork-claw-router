package types

// Iam user security setting record schema exposed by Claw Router.
type IamUserSecuritySettingRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	LastLoginAt string `json:"last_login_at"`
	LastLoginIpHash string `json:"last_login_ip_hash"`
	Metadata map[string]JsonValue `json:"metadata"`
	MfaEnabled bool `json:"mfa_enabled"`
	MfaMethod string `json:"mfa_method"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	PasswordLastChangedAt string `json:"password_last_changed_at"`
	SecurityLevel string `json:"security_level"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	ThirdPartyBoundSnapshot map[string]JsonValue `json:"third_party_bound_snapshot"`
	TrustedDeviceCount int `json:"trusted_device_count"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

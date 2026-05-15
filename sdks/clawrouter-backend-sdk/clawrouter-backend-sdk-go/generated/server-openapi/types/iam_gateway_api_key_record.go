package types

// Iam gateway api key record schema exposed by Claw Router.
type IamGatewayApiKeyRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Environment string `json:"environment"`
	ExpireAt string `json:"expire_at"`
	GroupId string `json:"group_id"`
	HashAlg string `json:"hash_alg"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	KeyDisplayMasked string `json:"key_display_masked"`
	KeyHash string `json:"key_hash"`
	KeyPrefix string `json:"key_prefix"`
	LastRevealedAt string `json:"last_revealed_at"`
	LastUsedAt string `json:"last_used_at"`
	LastUsedIpHash string `json:"last_used_ip_hash"`
	LastUsedIpMasked string `json:"last_used_ip_masked"`
	LastUsedIpRegion string `json:"last_used_ip_region"`
	LegacyApiKeyId string `json:"legacy_api_key_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	PolicyId string `json:"policy_id"`
	QuotaPolicyId string `json:"quota_policy_id"`
	RateLimitPolicyId string `json:"rate_limit_policy_id"`
	RevokedAt string `json:"revoked_at"`
	RevokedBy string `json:"revoked_by"`
	RotatedFromKeyId string `json:"rotated_from_key_id"`
	SecretVersion string `json:"secret_version"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

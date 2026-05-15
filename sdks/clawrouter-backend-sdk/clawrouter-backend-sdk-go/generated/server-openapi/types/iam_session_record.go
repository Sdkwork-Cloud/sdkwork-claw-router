package types

// Iam session record schema exposed by Claw Router.
type IamSessionRecord struct {
	AccessTokenHash string `json:"access_token_hash"`
	AppId string `json:"app_id"`
	AuthLevel string `json:"auth_level"`
	AuthTokenHash string `json:"auth_token_hash"`
	CreatedAt string `json:"created_at"`
	DataScopeJson map[string]JsonValue `json:"data_scope_json"`
	DeploymentMode string `json:"deployment_mode"`
	Environment string `json:"environment"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	PermissionScopeJson map[string]JsonValue `json:"permission_scope_json"`
	RefreshTokenHash string `json:"refresh_token_hash"`
	RevokedAt string `json:"revoked_at"`
	ShardingKey string `json:"sharding_key"`
	ShardingStrategy string `json:"sharding_strategy"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
}

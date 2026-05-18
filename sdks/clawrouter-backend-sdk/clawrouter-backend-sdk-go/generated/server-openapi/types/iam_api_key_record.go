package types

// Iam api key record schema exposed by Claw Router.
type IamApiKeyRecord struct {
	CreatedAt string `json:"created_at"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	KeyHash string `json:"key_hash"`
	Name string `json:"name"`
	PermissionScopeJson map[string]JsonValue `json:"permission_scope_json"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
}

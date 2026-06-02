package types

// Commerce idempotency key record schema exposed by Claw Router.
type CommerceIdempotencyKeyRecord struct {
	CreatedAt string `json:"created_at"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	LockedUntil string `json:"locked_until"`
	OrganizationId string `json:"organization_id"`
	RequestHash string `json:"request_hash"`
	ResponseJson string `json:"response_json"`
	Scope string `json:"scope"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}

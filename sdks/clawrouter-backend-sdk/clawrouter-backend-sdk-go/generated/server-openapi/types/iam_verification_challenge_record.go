package types

// Iam verification challenge record schema exposed by Claw Router.
type IamVerificationChallengeRecord struct {
	ConsumedAt string `json:"consumed_at"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeliveryRequestId string `json:"delivery_request_id"`
	Id string `json:"id"`
	LockedUntil string `json:"locked_until"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	SaltRef string `json:"salt_ref"`
	Status string `json:"status"`
	TargetMasked string `json:"target_masked"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	VerifiedAt string `json:"verified_at"`
	Version string `json:"version"`
}

package types

// Iam verification challenge record schema exposed by Claw Router.
type IamVerificationChallengeRecord struct {
	ChallengeStatus string `json:"challenge_status"`
	Channel string `json:"channel"`
	CodeHash string `json:"code_hash"`
	CodeId string `json:"code_id"`
	ConsumedAt string `json:"consumed_at"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeliveryRequestId string `json:"delivery_request_id"`
	ExpiresAt string `json:"expires_at"`
	HashAlgorithm string `json:"hash_algorithm"`
	Id string `json:"id"`
	LockedUntil string `json:"locked_until"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PolicySnapshot map[string]JsonValue `json:"policy_snapshot"`
	SaltRef string `json:"salt_ref"`
	SceneCode string `json:"scene_code"`
	Status string `json:"status"`
	TargetHash string `json:"target_hash"`
	TargetMasked string `json:"target_masked"`
	TargetType string `json:"target_type"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	VerifiedAt string `json:"verified_at"`
	VerifyAttempts int `json:"verify_attempts"`
	Version string `json:"version"`
}

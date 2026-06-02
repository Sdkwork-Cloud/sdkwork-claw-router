package types

// Iam verification attempt record schema exposed by Claw Router.
type IamVerificationAttemptRecord struct {
	ChallengeId string `json:"challenge_id"`
	CreatedAt string `json:"created_at"`
	DeviceHash string `json:"device_hash"`
	FailureReason string `json:"failure_reason"`
	Id string `json:"id"`
	IpHash string `json:"ip_hash"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	Result string `json:"result"`
	RetentionUntil string `json:"retention_until"`
	RiskSnapshot map[string]JsonValue `json:"risk_snapshot"`
	SceneCode string `json:"scene_code"`
	Status string `json:"status"`
	TargetHash string `json:"target_hash"`
	TargetType string `json:"target_type"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

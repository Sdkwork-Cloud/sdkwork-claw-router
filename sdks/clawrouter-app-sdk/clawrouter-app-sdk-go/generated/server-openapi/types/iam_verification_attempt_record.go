package types

// Iam verification attempt record schema exposed by Claw Router.
type IamVerificationAttemptRecord struct {
	CreatedAt string `json:"created_at"`
	DeviceHash string `json:"device_hash"`
	FailureReason string `json:"failure_reason"`
	Id string `json:"id"`
	IpHash string `json:"ip_hash"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

package types

// Iam user login event record schema exposed by Claw Router.
type IamUserLoginEventRecord struct {
	AuthMethod string `json:"auth_method"`
	AuthProvider string `json:"auth_provider"`
	ClientIpHash string `json:"client_ip_hash"`
	ClientIpMasked string `json:"client_ip_masked"`
	ClientIpRegion string `json:"client_ip_region"`
	CreatedAt string `json:"created_at"`
	DeviceFingerprintHash string `json:"device_fingerprint_hash"`
	DeviceLabel string `json:"device_label"`
	FailureReasonCode string `json:"failure_reason_code"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	LoginResult string `json:"login_result"`
	Metadata map[string]JsonValue `json:"metadata"`
	MfaVerified bool `json:"mfa_verified"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RiskLevel string `json:"risk_level"`
	SessionIdHash string `json:"session_id_hash"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserAgentHash string `json:"user_agent_hash"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

package types

// Iam security event record schema exposed by Claw Router.
type IamSecurityEventRecord struct {
	CreatedAt string `json:"created_at"`
	DetailJson map[string]JsonValue `json:"detail_json"`
	EventType string `json:"event_type"`
	Id string `json:"id"`
	SessionId string `json:"session_id"`
	Severity string `json:"severity"`
	TenantId string `json:"tenant_id"`
	UserId string `json:"user_id"`
}

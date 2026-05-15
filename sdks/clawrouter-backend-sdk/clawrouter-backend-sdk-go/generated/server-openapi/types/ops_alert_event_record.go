package types

// Ops alert event record schema exposed by Claw Router.
type OpsAlertEventRecord struct {
	AlertNo string `json:"alert_no"`
	AlertStatus string `json:"alert_status"`
	CreatedAt string `json:"created_at"`
	FirstSeenAt string `json:"first_seen_at"`
	Id string `json:"id"`
	LastSeenAt string `json:"last_seen_at"`
	LegalHold bool `json:"legal_hold"`
	Message string `json:"message"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	ResolvedAt string `json:"resolved_at"`
	ResolvedBy string `json:"resolved_by"`
	RetentionUntil string `json:"retention_until"`
	Severity string `json:"severity"`
	Source string `json:"source"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

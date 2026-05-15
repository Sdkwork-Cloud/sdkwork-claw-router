package types

// Content reaction record schema exposed by Claw Router.
type ContentReactionRecord struct {
	CancelledAt string `json:"cancelled_at"`
	ClientIpHash string `json:"client_ip_hash"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ReactionType string `json:"reaction_type"`
	ReactionValue string `json:"reaction_value"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Status string `json:"status"`
	TargetId string `json:"target_id"`
	TargetType string `json:"target_type"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserAgentHash string `json:"user_agent_hash"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

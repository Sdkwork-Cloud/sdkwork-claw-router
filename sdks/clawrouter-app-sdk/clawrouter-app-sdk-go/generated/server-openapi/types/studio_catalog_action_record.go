package types

// Studio catalog action record schema exposed by Claw Router.
type StudioCatalogActionRecord struct {
	ActionType string `json:"action_type"`
	ClientIpHash string `json:"client_ip_hash"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RatingScore string `json:"rating_score"`
	ReleaseId string `json:"release_id"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	ReviewBody string `json:"review_body"`
	ReviewTitle string `json:"review_title"`
	Status string `json:"status"`
	TargetId string `json:"target_id"`
	TargetType string `json:"target_type"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserAgentHash string `json:"user_agent_hash"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

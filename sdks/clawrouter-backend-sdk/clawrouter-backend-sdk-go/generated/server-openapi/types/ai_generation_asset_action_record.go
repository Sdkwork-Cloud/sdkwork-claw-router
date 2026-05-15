package types

// Ai generation asset action record schema exposed by Claw Router.
type AiGenerationAssetActionRecord struct {
	ActionParams map[string]JsonValue `json:"action_params"`
	ActionType string `json:"action_type"`
	AssetId string `json:"asset_id"`
	ClientIpHash string `json:"client_ip_hash"`
	ClientIpRegion string `json:"client_ip_region"`
	CompletedAt string `json:"completed_at"`
	CreatedAt string `json:"created_at"`
	FailureCode string `json:"failure_code"`
	Id string `json:"id"`
	JobId string `json:"job_id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	ResultAssetId string `json:"result_asset_id"`
	RetentionUntil string `json:"retention_until"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserAgentHash string `json:"user_agent_hash"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

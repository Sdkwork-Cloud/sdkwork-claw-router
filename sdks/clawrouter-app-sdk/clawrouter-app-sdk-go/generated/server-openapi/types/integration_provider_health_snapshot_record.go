package types

// Integration provider health snapshot record schema exposed by Claw Router.
type IntegrationProviderHealthSnapshotRecord struct {
	ChannelId string `json:"channel_id"`
	CheckType string `json:"check_type"`
	CheckedAt string `json:"checked_at"`
	CreatedAt string `json:"created_at"`
	ErrorCode string `json:"error_code"`
	ErrorMessageMasked string `json:"error_message_masked"`
	HealthStatus string `json:"health_status"`
	HttpStatus int `json:"http_status"`
	Id string `json:"id"`
	LatencyMs int `json:"latency_ms"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderId string `json:"provider_id"`
	QuotaSnapshot map[string]JsonValue `json:"quota_snapshot"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

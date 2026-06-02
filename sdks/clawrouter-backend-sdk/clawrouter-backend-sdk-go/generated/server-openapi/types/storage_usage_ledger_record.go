package types

// Storage usage ledger record schema exposed by Claw Router.
type StorageUsageLedgerRecord struct {
	AppId string `json:"app_id"`
	BusinessDomain string `json:"business_domain"`
	CreatedAt string `json:"created_at"`
	DeltaFileCount string `json:"delta_file_count"`
	DeltaLogicalBytes string `json:"delta_logical_bytes"`
	DeltaPhysicalBytes string `json:"delta_physical_bytes"`
	DeltaReservedBytes string `json:"delta_reserved_bytes"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	Reason string `json:"reason"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	ScopeId string `json:"scope_id"`
	ScopeType string `json:"scope_type"`
	SpaceId string `json:"space_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UsageEventType string `json:"usage_event_type"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

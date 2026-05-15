package types

// Ops config snapshot record schema exposed by Claw Router.
type OpsConfigSnapshotRecord struct {
	ConfigHash string `json:"config_hash"`
	ConfigPayload map[string]JsonValue `json:"config_payload"`
	ConfigScope string `json:"config_scope"`
	ConfigType string `json:"config_type"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PublishedAt string `json:"published_at"`
	PublishedBy string `json:"published_by"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RollbackFromSnapshotId string `json:"rollback_from_snapshot_id"`
	SnapshotNo string `json:"snapshot_no"`
	SourceIds map[string]JsonValue `json:"source_ids"`
	SourceTable string `json:"source_table"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

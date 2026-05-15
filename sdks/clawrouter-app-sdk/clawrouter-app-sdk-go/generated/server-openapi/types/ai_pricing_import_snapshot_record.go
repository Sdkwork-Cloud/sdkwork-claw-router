package types

// Ai pricing import snapshot record schema exposed by Claw Router.
type AiPricingImportSnapshotRecord struct {
	AcceptedCount string `json:"accepted_count"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DataFormat string `json:"data_format"`
	ErrorMessageMasked string `json:"error_message_masked"`
	Id string `json:"id"`
	ImportSource string `json:"import_source"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	NormalizedPayloadHash string `json:"normalized_payload_hash"`
	ObservedAt string `json:"observed_at"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PublishedAt string `json:"published_at"`
	RawPayloadRef string `json:"raw_payload_ref"`
	RejectedCount string `json:"rejected_count"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RowCount string `json:"row_count"`
	SchemaVersion string `json:"schema_version"`
	SourceHash string `json:"source_hash"`
	SourceName string `json:"source_name"`
	SourceUrl string `json:"source_url"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UpstreamCommit string `json:"upstream_commit"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

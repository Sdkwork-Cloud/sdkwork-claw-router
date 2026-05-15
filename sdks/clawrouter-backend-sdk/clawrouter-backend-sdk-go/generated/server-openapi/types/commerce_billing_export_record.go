package types

// Commerce billing export record schema exposed by Claw Router.
type CommerceBillingExportRecord struct {
	ApprovedBy string `json:"approved_by"`
	AuditLogId string `json:"audit_log_id"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	DownloadCount string `json:"download_count"`
	ExpireAt string `json:"expire_at"`
	ExportNo string `json:"export_no"`
	ExportType string `json:"export_type"`
	FileHash string `json:"file_hash"`
	FileManifest map[string]JsonValue `json:"file_manifest"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PeriodEnd string `json:"period_end"`
	PeriodStart string `json:"period_start"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	StatementId string `json:"statement_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

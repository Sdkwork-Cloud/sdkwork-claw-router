package types

// Integration provider invoice import record schema exposed by Claw Router.
type IntegrationProviderInvoiceImportRecord struct {
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	Id string `json:"id"`
	ImportNo string `json:"import_no"`
	ImportStatus string `json:"import_status"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PeriodEnd string `json:"period_end"`
	PeriodStart string `json:"period_start"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	SourceFileRef string `json:"source_file_ref"`
	SourceHash string `json:"source_hash"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TotalAmount string `json:"total_amount"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

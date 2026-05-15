package types

// Commerce usage statement record schema exposed by Claw Router.
type CommerceUsageStatementRecord struct {
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DueAt string `json:"due_at"`
	ExportId string `json:"export_id"`
	GeneratedAt string `json:"generated_at"`
	Id string `json:"id"`
	InvoiceId string `json:"invoice_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	PaidAt string `json:"paid_at"`
	PaymentStatus string `json:"payment_status"`
	Period string `json:"period"`
	PeriodEnd string `json:"period_end"`
	PeriodStart string `json:"period_start"`
	RebuildVersion string `json:"rebuild_version"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	StatementNo string `json:"statement_no"`
	StatementStatus string `json:"statement_status"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TotalCost string `json:"total_cost"`
	TotalRequests string `json:"total_requests"`
	TotalTokens string `json:"total_tokens"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
}

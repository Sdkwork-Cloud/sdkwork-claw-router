package types

// Commerce usage service provider statement record schema exposed by Claw Router.
type CommerceUsageServiceProviderStatementRecord struct {
	BuyerProviderId string `json:"buyer_provider_id"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DueAt string `json:"due_at"`
	GeneratedAt string `json:"generated_at"`
	Id string `json:"id"`
	InvoiceId string `json:"invoice_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PaidAt string `json:"paid_at"`
	PayableAmount string `json:"payable_amount"`
	PaymentStatus string `json:"payment_status"`
	Period string `json:"period"`
	PeriodEnd string `json:"period_end"`
	PeriodStart string `json:"period_start"`
	RebuildVersion string `json:"rebuild_version"`
	ReceivableAmount string `json:"receivable_amount"`
	SellerProviderId string `json:"seller_provider_id"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	StatementNo string `json:"statement_no"`
	StatementStatus string `json:"statement_status"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TotalRequests string `json:"total_requests"`
	TotalTokens string `json:"total_tokens"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
}

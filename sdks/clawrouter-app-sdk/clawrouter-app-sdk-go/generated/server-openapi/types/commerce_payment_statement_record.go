package types

// Commerce payment statement record schema exposed by Claw Router.
type CommercePaymentStatementRecord struct {
	CreatedAt string `json:"created_at"`
	DownloadStatus string `json:"download_status"`
	DownloadedAt string `json:"downloaded_at"`
	FeeAmount string `json:"fee_amount"`
	FileDigest string `json:"file_digest"`
	FileRef string `json:"file_ref"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	NetAmount string `json:"net_amount"`
	OrganizationId string `json:"organization_id"`
	ParseStatus string `json:"parse_status"`
	ParsedAt string `json:"parsed_at"`
	PeriodEnd string `json:"period_end"`
	PeriodStart string `json:"period_start"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	ProviderStatementId string `json:"provider_statement_id"`
	RequestNo string `json:"request_no"`
	RowCount string `json:"row_count"`
	SettlementCurrency string `json:"settlement_currency"`
	StatementNo string `json:"statement_no"`
	StatementType string `json:"statement_type"`
	TenantId string `json:"tenant_id"`
	TotalAmount string `json:"total_amount"`
	UpdatedAt string `json:"updated_at"`
}

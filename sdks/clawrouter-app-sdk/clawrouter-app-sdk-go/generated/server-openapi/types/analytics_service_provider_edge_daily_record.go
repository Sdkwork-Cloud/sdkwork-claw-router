package types

// Analytics service provider edge daily record schema exposed by Claw Router.
type AnalyticsServiceProviderEdgeDailyRecord struct {
	BillingMeterCode string `json:"billing_meter_code"`
	BuyerProviderId string `json:"buyer_provider_id"`
	CatalogKey string `json:"catalog_key"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	EdgeId string `json:"edge_id"`
	ExpenseAmount string `json:"expense_amount"`
	Id string `json:"id"`
	IncomeAmount string `json:"income_amount"`
	MarginAmount string `json:"margin_amount"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	OrganizationId string `json:"organization_id"`
	RebuildVersion string `json:"rebuild_version"`
	ReportDate string `json:"report_date"`
	RequestCount string `json:"request_count"`
	SellerProviderId string `json:"seller_provider_id"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TokenCount string `json:"token_count"`
	TokenKind string `json:"token_kind"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
}

package types

// Commerce usage service provider reconciliation item record schema exposed by Claw Router.
type CommerceUsageServiceProviderReconciliationItemRecord struct {
	CreatedAt string `json:"created_at"`
	DifferenceAmount string `json:"difference_amount"`
	ExternalAmount string `json:"external_amount"`
	Id string `json:"id"`
	InternalAmount string `json:"internal_amount"`
	LegalHold bool `json:"legal_hold"`
	MatchStatus string `json:"match_status"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ProviderInvoiceItemId string `json:"provider_invoice_item_id"`
	ReasonCode string `json:"reason_code"`
	RequestId string `json:"request_id"`
	ResolutionStatus string `json:"resolution_status"`
	RetentionUntil string `json:"retention_until"`
	RunId string `json:"run_id"`
	StatementItemId string `json:"statement_item_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UsageEdgeId string `json:"usage_edge_id"`
	UsageFactId string `json:"usage_fact_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

package types

// Commerce usage service provider statement item record schema exposed by Claw Router.
type CommerceUsageServiceProviderStatementItemRecord struct {
	Amount string `json:"amount"`
	BillingMeterCode string `json:"billing_meter_code"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	OrganizationId string `json:"organization_id"`
	Quantity string `json:"quantity"`
	RebuildVersion string `json:"rebuild_version"`
	RequestCount string `json:"request_count"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceUsageFactIds map[string]JsonValue `json:"source_usage_fact_ids"`
	SourceVersion string `json:"source_version"`
	StatementId string `json:"statement_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TokenCount string `json:"token_count"`
	TokenKind string `json:"token_kind"`
	UpdatedAt string `json:"updated_at"`
	UsageEdgeId string `json:"usage_edge_id"`
	Uuid string `json:"uuid"`
}

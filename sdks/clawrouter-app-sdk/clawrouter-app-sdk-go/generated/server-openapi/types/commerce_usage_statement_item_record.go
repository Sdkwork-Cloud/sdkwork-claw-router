package types

// Commerce usage statement item record schema exposed by Claw Router.
type CommerceUsageStatementItemRecord struct {
	AssetCount string `json:"asset_count"`
	BreakdownPayload map[string]JsonValue `json:"breakdown_payload"`
	CostAmount string `json:"cost_amount"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DurationSeconds string `json:"duration_seconds"`
	Id string `json:"id"`
	ItemType string `json:"item_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	Modality string `json:"modality"`
	Model string `json:"model"`
	ModelList map[string]JsonValue `json:"model_list"`
	OrganizationId string `json:"organization_id"`
	ProviderCode string `json:"provider_code"`
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
	UpdatedAt string `json:"updated_at"`
	UsageText string `json:"usage_text"`
	Uuid string `json:"uuid"`
}

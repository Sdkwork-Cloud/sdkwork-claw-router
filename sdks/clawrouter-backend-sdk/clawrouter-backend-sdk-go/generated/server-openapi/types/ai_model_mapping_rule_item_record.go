package types

// Ai model mapping rule item record schema exposed by Claw Router.
type AiModelMappingRuleItemRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Enabled bool `json:"enabled"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	RuleId string `json:"rule_id"`
	RuleUuid string `json:"rule_uuid"`
	SortOrder int `json:"sort_order"`
	SourceCatalogKey string `json:"source_catalog_key"`
	SourceModel string `json:"source_model"`
	Status string `json:"status"`
	TargetCatalogKey string `json:"target_catalog_key"`
	TargetModel string `json:"target_model"`
	TargetProviderModel string `json:"target_provider_model"`
	TargetProviderNativeModel string `json:"target_provider_native_model"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

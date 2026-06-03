package types

// Ai model mapping rule binding record schema exposed by Claw Router.
type AiModelMappingRuleBindingRecord struct {
	BindingCode string `json:"binding_code"`
	BindingId string `json:"binding_id"`
	BindingNameSnapshot string `json:"binding_name_snapshot"`
	BindingType string `json:"binding_type"`
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
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

package types

// Ai model mapping rule record schema exposed by Claw Router.
type AiModelMappingRuleRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Enabled bool `json:"enabled"`
	Id string `json:"id"`
	MappingMode string `json:"mapping_mode"`
	MatchType string `json:"match_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	SourceVendorCode string `json:"source_vendor_code"`
	SourceVendorId string `json:"source_vendor_id"`
	Status string `json:"status"`
	TargetVendorCode string `json:"target_vendor_code"`
	TargetVendorId string `json:"target_vendor_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

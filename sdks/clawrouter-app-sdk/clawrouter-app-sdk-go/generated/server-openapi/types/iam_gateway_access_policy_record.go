package types

// Iam gateway access policy record schema exposed by Claw Router.
type IamGatewayAccessPolicyRecord struct {
	AllowedCapabilities map[string]JsonValue `json:"allowed_capabilities"`
	AllowedModels map[string]JsonValue `json:"allowed_models"`
	CreatedAt string `json:"created_at"`
	DataRetentionMode string `json:"data_retention_mode"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeniedCapabilities map[string]JsonValue `json:"denied_capabilities"`
	DeniedModels map[string]JsonValue `json:"denied_models"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	IpAllowlist map[string]JsonValue `json:"ip_allowlist"`
	IpDenylist map[string]JsonValue `json:"ip_denylist"`
	IpRuleCount int `json:"ip_rule_count"`
	MaxContextTokens string `json:"max_context_tokens"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	NetworkPolicyMode string `json:"network_policy_mode"`
	OrganizationId string `json:"organization_id"`
	PolicyType string `json:"policy_type"`
	RegionAllowlist map[string]JsonValue `json:"region_allowlist"`
	Status string `json:"status"`
	SubjectId string `json:"subject_id"`
	SubjectRefHash string `json:"subject_ref_hash"`
	SubjectRefMasked string `json:"subject_ref_masked"`
	SubjectType string `json:"subject_type"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

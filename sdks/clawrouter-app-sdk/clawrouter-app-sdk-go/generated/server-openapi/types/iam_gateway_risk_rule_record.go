package types

// Iam gateway risk rule record schema exposed by Claw Router.
type IamGatewayRiskRuleRecord struct {
	Action string `json:"action"`
	BlockDurationSeconds string `json:"block_duration_seconds"`
	BurstLimit string `json:"burst_limit"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	HitCount string `json:"hit_count"`
	Id string `json:"id"`
	LastHitAt string `json:"last_hit_at"`
	MatchMode string `json:"match_mode"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Priority int `json:"priority"`
	Reason string `json:"reason"`
	RequestsPerDay string `json:"requests_per_day"`
	RequestsPerMinute string `json:"requests_per_minute"`
	RequestsPerSecond string `json:"requests_per_second"`
	RuleCategory string `json:"rule_category"`
	RuleName string `json:"rule_name"`
	RuleType string `json:"rule_type"`
	ScopeId string `json:"scope_id"`
	ScopeType string `json:"scope_type"`
	Status string `json:"status"`
	TargetType string `json:"target_type"`
	TargetValue string `json:"target_value"`
	TargetValueCipherRef string `json:"target_value_cipher_ref"`
	TargetValueHash string `json:"target_value_hash"`
	TargetValueMasked string `json:"target_value_masked"`
	TenantId string `json:"tenant_id"`
	TokensPerMinute string `json:"tokens_per_minute"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

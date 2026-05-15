package types

// Ai routing rule record schema exposed by Claw Router.
type AiRoutingRuleRecord struct {
	CandidateChannels map[string]JsonValue `json:"candidate_channels"`
	Constraints map[string]JsonValue `json:"constraints"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	FallbackChain map[string]JsonValue `json:"fallback_chain"`
	Id string `json:"id"`
	MatchExpression map[string]JsonValue `json:"match_expression"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Priority int `json:"priority"`
	ProfileId string `json:"profile_id"`
	RateLimitPolicyId string `json:"rate_limit_policy_id"`
	RuleCode string `json:"rule_code"`
	Status string `json:"status"`
	TargetModel string `json:"target_model"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

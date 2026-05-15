package types

// Ai routing decision log record schema exposed by Claw Router.
type AiRoutingDecisionLogRecord struct {
	ApiKeyId string `json:"api_key_id"`
	CandidateSnapshot map[string]JsonValue `json:"candidate_snapshot"`
	Capability string `json:"capability"`
	CreatedAt string `json:"created_at"`
	DecisionLatencyMs int `json:"decision_latency_ms"`
	DecisionMode string `json:"decision_mode"`
	DecisionReason map[string]JsonValue `json:"decision_reason"`
	FallbackChain map[string]JsonValue `json:"fallback_chain"`
	Id string `json:"id"`
	LegacyApiKeyId string `json:"legacy_api_key_id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PolicyId string `json:"policy_id"`
	ProfileId string `json:"profile_id"`
	RequestId string `json:"request_id"`
	RequestedModel string `json:"requested_model"`
	ResolvedModel string `json:"resolved_model"`
	RetentionUntil string `json:"retention_until"`
	RuleId string `json:"rule_id"`
	SelectedAccountId string `json:"selected_account_id"`
	SelectedChannelId string `json:"selected_channel_id"`
	SelectedProviderId string `json:"selected_provider_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

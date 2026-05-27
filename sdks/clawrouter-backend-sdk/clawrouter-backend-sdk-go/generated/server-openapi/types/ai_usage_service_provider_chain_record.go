package types

// Ai usage service provider chain record schema exposed by Claw Router.
type AiUsageServiceProviderChainRecord struct {
	ChainDepth int `json:"chain_depth"`
	ChainHash string `json:"chain_hash"`
	ChainPathSnapshot map[string]JsonValue `json:"chain_path_snapshot"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	LeafProviderId string `json:"leaf_provider_id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	ResolvedSubjectId string `json:"resolved_subject_id"`
	ResolvedSubjectType string `json:"resolved_subject_type"`
	RetentionUntil string `json:"retention_until"`
	RootProviderId string `json:"root_provider_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UsageFactId string `json:"usage_fact_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

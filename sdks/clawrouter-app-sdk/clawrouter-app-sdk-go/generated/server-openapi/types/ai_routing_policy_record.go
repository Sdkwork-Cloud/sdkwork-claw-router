package types

// Ai routing policy record schema exposed by Claw Router.
type AiRoutingPolicyRecord struct {
	Capability string `json:"capability"`
	CostCeiling string `json:"cost_ceiling"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DataScope string `json:"data_scope"`
	DefaultProfileId string `json:"default_profile_id"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	FallbackMode string `json:"fallback_mode"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PolicyCode string `json:"policy_code"`
	PolicyScope string `json:"policy_scope"`
	SloLatencyMs int `json:"slo_latency_ms"`
	SloSuccessRate string `json:"slo_success_rate"`
	Status string `json:"status"`
	SubjectId string `json:"subject_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

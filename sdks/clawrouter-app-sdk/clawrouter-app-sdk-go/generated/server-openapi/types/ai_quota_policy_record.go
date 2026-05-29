package types

// Ai quota policy record schema exposed by Claw Router.
type AiQuotaPolicyRecord struct {
	BlockDurationSeconds string `json:"block_duration_seconds"`
	BurstLimit string `json:"burst_limit"`
	ChannelGroupId string `json:"channel_group_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	ExhaustedAt string `json:"exhausted_at"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PolicyCode string `json:"policy_code"`
	QuotaLimit string `json:"quota_limit"`
	QuotaPeriod string `json:"quota_period"`
	QuotaUnit string `json:"quota_unit"`
	RequestsPerDay string `json:"requests_per_day"`
	RequestsPerMinute string `json:"requests_per_minute"`
	RequestsPerSecond string `json:"requests_per_second"`
	ResetMode string `json:"reset_mode"`
	ScopeId string `json:"scope_id"`
	ScopeType string `json:"scope_type"`
	Status string `json:"status"`
	SubjectId string `json:"subject_id"`
	SubjectRefHash string `json:"subject_ref_hash"`
	SubjectRefMasked string `json:"subject_ref_masked"`
	SubjectType string `json:"subject_type"`
	TenantId string `json:"tenant_id"`
	TokensPerMinute string `json:"tokens_per_minute"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

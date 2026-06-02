package types

// Iam verification scene policy record schema exposed by Claw Router.
type IamVerificationScenePolicyRecord struct {
	AllowedChannels map[string]JsonValue `json:"allowed_channels"`
	CodeCharset string `json:"code_charset"`
	CodeLength int `json:"code_length"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultChannel string `json:"default_channel"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	MaxSendPerHour int `json:"max_send_per_hour"`
	MaxVerifyAttempts int `json:"max_verify_attempts"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ResendIntervalSeconds int `json:"resend_interval_seconds"`
	RiskPolicy map[string]JsonValue `json:"risk_policy"`
	RolloutPolicy map[string]JsonValue `json:"rollout_policy"`
	SceneCode string `json:"scene_code"`
	SceneName string `json:"scene_name"`
	Status string `json:"status"`
	TargetBindingRequired bool `json:"target_binding_required"`
	TemplateCode string `json:"template_code"`
	TenantId string `json:"tenant_id"`
	TtlSeconds int `json:"ttl_seconds"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

package types

// Studio app template usage record schema exposed by Claw Router.
type StudioAppTemplateUsageRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	InputSnapshot map[string]JsonValue `json:"input_snapshot"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OutputSnapshot map[string]JsonValue `json:"output_snapshot"`
	RequestId string `json:"request_id"`
	Status string `json:"status"`
	TargetAppId string `json:"target_app_id"`
	TemplateId string `json:"template_id"`
	TemplateVersionId string `json:"template_version_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UsageType string `json:"usage_type"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

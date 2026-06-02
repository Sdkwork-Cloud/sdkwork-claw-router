package types

// Messaging template variant record schema exposed by Claw Router.
type MessagingTemplateVariantRecord struct {
	BodyTemplate string `json:"body_template"`
	Channel string `json:"channel"`
	ContentFormat string `json:"content_format"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	LengthLimit int `json:"length_limit"`
	Locale string `json:"locale"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderPayloadSchema map[string]JsonValue `json:"provider_payload_schema"`
	RenderOptions map[string]JsonValue `json:"render_options"`
	Status string `json:"status"`
	TemplateVersionId string `json:"template_version_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

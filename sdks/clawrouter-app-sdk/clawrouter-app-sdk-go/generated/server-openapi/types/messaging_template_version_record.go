package types

// Messaging template version record schema exposed by Claw Router.
type MessagingTemplateVersionRecord struct {
	ContentHash string `json:"content_hash"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	HtmlTemplate string `json:"html_template"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	RenderEngine string `json:"render_engine"`
	RetiredAt string `json:"retired_at"`
	ReviewStatus string `json:"review_status"`
	Status string `json:"status"`
	SubjectTemplate string `json:"subject_template"`
	TemplateId string `json:"template_id"`
	TenantId string `json:"tenant_id"`
	TextTemplate string `json:"text_template"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VariableSchema map[string]JsonValue `json:"variable_schema"`
	Version string `json:"version"`
	VersionNo int `json:"version_no"`
}

package types

// Messaging template version record schema exposed by Claw Router.
type MessagingTemplateVersionRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	HtmlTemplate string `json:"html_template"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	RetiredAt string `json:"retired_at"`
	Status string `json:"status"`
	SubjectTemplate string `json:"subject_template"`
	TenantId string `json:"tenant_id"`
	TextTemplate string `json:"text_template"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

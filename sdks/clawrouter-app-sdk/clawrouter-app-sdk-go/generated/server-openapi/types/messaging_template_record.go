package types

// Messaging template record schema exposed by Claw Router.
type MessagingTemplateRecord struct {
	Category string `json:"category"`
	Channel string `json:"channel"`
	CreatedAt string `json:"created_at"`
	CurrentVersionId string `json:"current_version_id"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeliveryPurpose string `json:"delivery_purpose"`
	Description string `json:"description"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerAppId string `json:"owner_app_id"`
	PublishStatus string `json:"publish_status"`
	SceneCode string `json:"scene_code"`
	Status string `json:"status"`
	TemplateCode string `json:"template_code"`
	TemplateName string `json:"template_name"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

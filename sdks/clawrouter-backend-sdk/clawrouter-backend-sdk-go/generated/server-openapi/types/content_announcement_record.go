package types

// Content announcement record schema exposed by Claw Router.
type ContentAnnouncementRecord struct {
	AnnouncementType string `json:"announcement_type"`
	AudienceFilter map[string]JsonValue `json:"audience_filter"`
	Content string `json:"content"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Pinned bool `json:"pinned"`
	PublishedAt string `json:"published_at"`
	Status string `json:"status"`
	TargetScope string `json:"target_scope"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

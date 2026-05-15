package types

// Content course application record schema exposed by Claw Router.
type ContentCourseApplicationRecord struct {
	Category string `json:"category"`
	ContactEmail string `json:"contact_email"`
	ContactName string `json:"contact_name"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	ExternalBvid string `json:"external_bvid"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	ReviewComment string `json:"review_comment"`
	ReviewedAt string `json:"reviewed_at"`
	ReviewedBy string `json:"reviewed_by"`
	SourceProvider string `json:"source_provider"`
	Status string `json:"status"`
	SubmittedAt string `json:"submitted_at"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	VideoUrl string `json:"video_url"`
}

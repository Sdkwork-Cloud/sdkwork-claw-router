package types

// Content course lesson record schema exposed by Claw Router.
type ContentCourseLessonRecord struct {
	Content string `json:"content"`
	CourseId string `json:"course_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DurationSeconds string `json:"duration_seconds"`
	DurationText string `json:"duration_text"`
	ExternalBvid string `json:"external_bvid"`
	FreePreview bool `json:"free_preview"`
	Id string `json:"id"`
	LessonNo int `json:"lesson_no"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	SectionId string `json:"section_id"`
	SortOrder int `json:"sort_order"`
	SourceProvider string `json:"source_provider"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Video MediaResource `json:"video"`
}

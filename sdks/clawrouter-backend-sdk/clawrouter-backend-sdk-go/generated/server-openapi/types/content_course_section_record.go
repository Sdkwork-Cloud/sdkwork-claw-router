package types

// Content course section record schema exposed by Claw Router.
type ContentCourseSectionRecord struct {
	CourseId string `json:"course_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DurationSeconds string `json:"duration_seconds"`
	Id string `json:"id"`
	LessonCount int `json:"lesson_count"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	SectionNo int `json:"section_no"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

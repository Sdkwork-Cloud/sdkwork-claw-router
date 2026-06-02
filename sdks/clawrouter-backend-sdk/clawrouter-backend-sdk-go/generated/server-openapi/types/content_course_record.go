package types

// Content course record schema exposed by Claw Router.
type ContentCourseRecord struct {
	Category string `json:"category"`
	Content string `json:"content"`
	CourseCode string `json:"course_code"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DurationText string `json:"duration_text"`
	ExternalBvid string `json:"external_bvid"`
	Id string `json:"id"`
	InstructorSnapshot map[string]JsonValue `json:"instructor_snapshot"`
	IsCollection bool `json:"is_collection"`
	LessonsCount int `json:"lessons_count"`
	Level string `json:"level"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PriceAmount string `json:"price_amount"`
	PublishedAt string `json:"published_at"`
	RatingScore string `json:"rating_score"`
	Status string `json:"status"`
	StudentsCount string `json:"students_count"`
	Tags map[string]JsonValue `json:"tags"`
	TenantId string `json:"tenant_id"`
	Thumbnail MediaResource `json:"thumbnail"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}

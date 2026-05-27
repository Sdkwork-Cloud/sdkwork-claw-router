package types

// Admin course lesson mutation request schema exposed by Claw Router.
type AdminCourseLessonMutationRequest struct {
	Description string `json:"description"`
	DurationSeconds int `json:"durationSeconds"`
	ExternalBvid string `json:"externalBvid"`
	FreePreview bool `json:"freePreview"`
	LessonNo string `json:"lessonNo"`
	Metadata map[string]JsonValue `json:"metadata"`
	SectionId string `json:"sectionId"`
	Status string `json:"status"`
	Title string `json:"title"`
	VideoUrl string `json:"videoUrl"`
}

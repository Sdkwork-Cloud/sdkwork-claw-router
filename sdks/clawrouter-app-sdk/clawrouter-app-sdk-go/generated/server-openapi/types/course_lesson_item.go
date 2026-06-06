package types

// Course lesson item schema exposed by Claw Router.
type CourseLessonItem struct {
	Content string `json:"content"`
	Description string `json:"description"`
	DurationSeconds string `json:"durationSeconds"`
	DurationText string `json:"durationText"`
	ExternalBvid string `json:"externalBvid"`
	FreePreview bool `json:"freePreview"`
	Id string `json:"id"`
	LessonId string `json:"lessonId"`
	LessonNo string `json:"lessonNo"`
	Number string `json:"number"`
	SortOrder string `json:"sortOrder"`
	SourceProvider string `json:"sourceProvider"`
	Title string `json:"title"`
	Video MediaResource `json:"video"`
}

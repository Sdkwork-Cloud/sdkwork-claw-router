package types

// Course lesson item schema exposed by Claw Router.
type CourseLessonItem struct {
	Content string `json:"content"`
	Description string `json:"description"`
	DurationSeconds int `json:"durationSeconds"`
	DurationText string `json:"durationText"`
	ExternalBvid string `json:"externalBvid"`
	FreePreview bool `json:"freePreview"`
	Id string `json:"id"`
	LessonId int `json:"lessonId"`
	LessonNo int `json:"lessonNo"`
	Number int `json:"number"`
	SortOrder int `json:"sortOrder"`
	SourceProvider string `json:"sourceProvider"`
	Title string `json:"title"`
	Video MediaResource `json:"video"`
}

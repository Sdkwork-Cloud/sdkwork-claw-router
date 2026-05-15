package types

// Course section item schema exposed by Claw Router.
type CourseSectionItem struct {
	Description string `json:"description"`
	DurationSeconds int `json:"durationSeconds"`
	Id string `json:"id"`
	LessonCount int `json:"lessonCount"`
	Lessons []CourseLessonItem `json:"lessons"`
	SectionId int `json:"sectionId"`
	SectionNo int `json:"sectionNo"`
	SortOrder int `json:"sortOrder"`
	Title string `json:"title"`
}

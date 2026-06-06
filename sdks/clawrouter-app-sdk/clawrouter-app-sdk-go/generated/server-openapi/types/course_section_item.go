package types

// Course section item schema exposed by Claw Router.
type CourseSectionItem struct {
	Description string `json:"description"`
	DurationSeconds string `json:"durationSeconds"`
	Id string `json:"id"`
	LessonCount string `json:"lessonCount"`
	Lessons []CourseLessonItem `json:"lessons"`
	SectionId string `json:"sectionId"`
	SectionNo string `json:"sectionNo"`
	SortOrder string `json:"sortOrder"`
	Title string `json:"title"`
}

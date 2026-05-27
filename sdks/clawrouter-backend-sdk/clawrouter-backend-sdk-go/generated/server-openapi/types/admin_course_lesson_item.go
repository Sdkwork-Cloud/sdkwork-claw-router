package types

// Admin course lesson item schema exposed by Claw Router.
type AdminCourseLessonItem struct {
	CourseId string `json:"courseId"`
	Id string `json:"id"`
	SectionId string `json:"sectionId"`
	Status string `json:"status"`
	Title string `json:"title"`
}

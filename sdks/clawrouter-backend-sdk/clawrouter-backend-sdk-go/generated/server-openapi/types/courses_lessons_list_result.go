package types

// Courses lessons list result schema exposed by Claw Router.
type CoursesLessonsListResult struct {
	Code string `json:"code"`
	Data AdminCourseLessonCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

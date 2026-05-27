package types

// Courses lessons create result schema exposed by Claw Router.
type CoursesLessonsCreateResult struct {
	Code string `json:"code"`
	Data AdminCourseLessonMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

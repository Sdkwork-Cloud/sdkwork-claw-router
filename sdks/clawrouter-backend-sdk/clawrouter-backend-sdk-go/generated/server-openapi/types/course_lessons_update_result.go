package types

// Course lessons update result schema exposed by Claw Router.
type CourseLessonsUpdateResult struct {
	Code string `json:"code"`
	Data AdminCourseLessonMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

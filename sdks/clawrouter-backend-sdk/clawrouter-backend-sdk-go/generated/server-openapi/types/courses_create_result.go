package types

// Courses create result schema exposed by Claw Router.
type CoursesCreateResult struct {
	Code string `json:"code"`
	Data AdminCourseMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

package types

// Courses update result schema exposed by Claw Router.
type CoursesUpdateResult struct {
	Code string `json:"code"`
	Data AdminCourseMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

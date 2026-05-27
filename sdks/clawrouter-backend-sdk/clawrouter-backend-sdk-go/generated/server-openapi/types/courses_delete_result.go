package types

// Courses delete result schema exposed by Claw Router.
type CoursesDeleteResult struct {
	Code string `json:"code"`
	Data AdminCourseDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}

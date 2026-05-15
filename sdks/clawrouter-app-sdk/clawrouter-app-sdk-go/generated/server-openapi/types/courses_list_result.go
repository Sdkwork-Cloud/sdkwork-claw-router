package types

// Courses list result schema exposed by Claw Router.
type CoursesListResult struct {
	Code string `json:"code"`
	Data CourseListResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

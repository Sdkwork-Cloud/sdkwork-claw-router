package types

// Courses retrieve result schema exposed by Claw Router.
type CoursesRetrieveResult struct {
	Code string `json:"code"`
	Data CourseDetail `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

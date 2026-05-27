package types

// Courses list result schema exposed by Claw Router.
type CoursesListResult struct {
	Code string `json:"code"`
	Data AdminCourseCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

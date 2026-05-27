package types

// Course applications list result schema exposed by Claw Router.
type CourseApplicationsListResult struct {
	Code string `json:"code"`
	Data AdminCourseApplicationCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

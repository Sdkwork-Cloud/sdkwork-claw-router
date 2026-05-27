package types

// Courses dashboard retrieve result schema exposed by Claw Router.
type CoursesDashboardRetrieveResult struct {
	Code string `json:"code"`
	Data AdminCourseDashboardResponse `json:"data"`
	Msg string `json:"msg"`
}

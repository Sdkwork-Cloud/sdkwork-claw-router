package types

// Courses overview retrieve result schema exposed by Claw Router.
type CoursesOverviewRetrieveResult struct {
	Code string `json:"code"`
	Data CourseOverview `json:"data"`
	Msg string `json:"msg"`
}

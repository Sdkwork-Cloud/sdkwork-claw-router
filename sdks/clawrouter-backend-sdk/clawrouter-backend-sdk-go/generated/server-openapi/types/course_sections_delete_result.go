package types

// Course sections delete result schema exposed by Claw Router.
type CourseSectionsDeleteResult struct {
	Code string `json:"code"`
	Data AdminCourseDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}

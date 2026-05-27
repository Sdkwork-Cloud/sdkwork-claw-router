package types

// Course lessons delete result schema exposed by Claw Router.
type CourseLessonsDeleteResult struct {
	Code string `json:"code"`
	Data AdminCourseDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}

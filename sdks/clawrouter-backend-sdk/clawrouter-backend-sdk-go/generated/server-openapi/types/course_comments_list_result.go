package types

// Course comments list result schema exposed by Claw Router.
type CourseCommentsListResult struct {
	Code string `json:"code"`
	Data AdminCourseCommentCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

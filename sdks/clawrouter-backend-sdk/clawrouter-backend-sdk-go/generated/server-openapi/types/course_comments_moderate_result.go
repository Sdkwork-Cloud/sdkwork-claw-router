package types

// Course comments moderate result schema exposed by Claw Router.
type CourseCommentsModerateResult struct {
	Code string `json:"code"`
	Data AdminCourseCommentCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}

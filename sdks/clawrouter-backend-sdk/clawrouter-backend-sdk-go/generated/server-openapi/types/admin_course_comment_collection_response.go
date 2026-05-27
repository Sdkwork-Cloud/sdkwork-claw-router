package types

// Admin course comment collection response schema exposed by Claw Router.
type AdminCourseCommentCollectionResponse struct {
	Items []AdminCourseCommentItem `json:"items"`
}

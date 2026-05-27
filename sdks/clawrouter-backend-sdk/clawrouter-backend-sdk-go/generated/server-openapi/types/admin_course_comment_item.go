package types

// Admin course comment item schema exposed by Claw Router.
type AdminCourseCommentItem struct {
	Author string `json:"author"`
	Content string `json:"content"`
	CourseId string `json:"courseId"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	Status string `json:"status"`
}

package types

// Admin course engagement item schema exposed by Claw Router.
type AdminCourseEngagementItem struct {
	Count string `json:"count"`
	CourseId string `json:"courseId"`
	Id string `json:"id"`
	ReactionType string `json:"reactionType"`
	ReactionValue string `json:"reactionValue"`
	Status string `json:"status"`
}

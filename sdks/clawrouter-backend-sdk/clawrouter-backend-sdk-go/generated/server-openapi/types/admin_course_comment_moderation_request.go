package types

// Admin course comment moderation request schema exposed by Claw Router.
type AdminCourseCommentModerationRequest struct {
	ModerationNote string `json:"moderationNote"`
	Status string `json:"status"`
}

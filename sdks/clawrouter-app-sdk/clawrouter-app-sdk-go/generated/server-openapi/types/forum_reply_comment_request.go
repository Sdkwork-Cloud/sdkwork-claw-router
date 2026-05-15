package types

// Forum reply comment request schema exposed by Claw Router.
type ForumReplyCommentRequest struct {
	Content string `json:"content"`
	DeviceInfo string `json:"deviceInfo"`
}

package types

// Forum create comment request schema exposed by Claw Router.
type ForumCreateCommentRequest struct {
	Content string `json:"content"`
	ContentId string `json:"contentId"`
	ContentType string `json:"contentType"`
	DeviceInfo string `json:"deviceInfo"`
}

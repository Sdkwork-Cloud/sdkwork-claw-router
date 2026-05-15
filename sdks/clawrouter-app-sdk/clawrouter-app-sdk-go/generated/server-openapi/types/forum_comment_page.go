package types

// Forum comment page schema exposed by Claw Router.
type ForumCommentPage struct {
	Content []ForumCommentItem `json:"content"`
	Items []ForumCommentItem `json:"items"`
	Page int `json:"page"`
	Size int `json:"size"`
	TotalElements int `json:"totalElements"`
}

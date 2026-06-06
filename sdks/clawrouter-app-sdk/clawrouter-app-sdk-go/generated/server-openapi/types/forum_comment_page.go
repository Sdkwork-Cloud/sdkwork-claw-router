package types

// Forum comment page schema exposed by Claw Router.
type ForumCommentPage struct {
	Content []ForumCommentItem `json:"content"`
	Items []ForumCommentItem `json:"items"`
	Page string `json:"page"`
	Size string `json:"size"`
	TotalElements string `json:"totalElements"`
}

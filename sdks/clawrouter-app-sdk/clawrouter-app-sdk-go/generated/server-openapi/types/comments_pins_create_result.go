package types

// Comments pins create result schema exposed by Claw Router.
type CommentsPinsCreateResult struct {
	Code string `json:"code"`
	Data ForumCommentItem `json:"data"`
	Msg string `json:"msg"`
}

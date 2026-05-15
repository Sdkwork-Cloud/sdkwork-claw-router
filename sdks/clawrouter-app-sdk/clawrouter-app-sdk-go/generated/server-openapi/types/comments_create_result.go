package types

// Comments create result schema exposed by Claw Router.
type CommentsCreateResult struct {
	Code string `json:"code"`
	Data ForumCommentItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

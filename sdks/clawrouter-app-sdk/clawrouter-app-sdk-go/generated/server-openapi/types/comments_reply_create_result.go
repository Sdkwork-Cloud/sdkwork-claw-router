package types

// Comments reply create result schema exposed by Claw Router.
type CommentsReplyCreateResult struct {
	Code string `json:"code"`
	Data ForumCommentItem `json:"data"`
	Msg string `json:"msg"`
}

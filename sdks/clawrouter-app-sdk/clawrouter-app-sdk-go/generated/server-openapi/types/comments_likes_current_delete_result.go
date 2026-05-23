package types

// Comments likes current delete result schema exposed by Claw Router.
type CommentsLikesCurrentDeleteResult struct {
	Code string `json:"code"`
	Data ForumCommentItem `json:"data"`
	Msg string `json:"msg"`
}

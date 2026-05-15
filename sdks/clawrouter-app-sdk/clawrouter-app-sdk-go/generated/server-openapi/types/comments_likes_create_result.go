package types

// Comments likes create result schema exposed by Claw Router.
type CommentsLikesCreateResult struct {
	Code string `json:"code"`
	Data ForumCommentItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

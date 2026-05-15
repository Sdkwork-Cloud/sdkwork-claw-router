package types

// Comments list result schema exposed by Claw Router.
type CommentsListResult struct {
	Code string `json:"code"`
	Data ForumCommentPage `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

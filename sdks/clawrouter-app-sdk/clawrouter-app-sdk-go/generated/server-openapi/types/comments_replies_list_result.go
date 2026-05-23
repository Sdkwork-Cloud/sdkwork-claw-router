package types

// Comments replies list result schema exposed by Claw Router.
type CommentsRepliesListResult struct {
	Code string `json:"code"`
	Data ForumCommentPage `json:"data"`
	Msg string `json:"msg"`
}

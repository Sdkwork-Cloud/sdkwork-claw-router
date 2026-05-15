package types

// Users current comments list result schema exposed by Claw Router.
type UsersCurrentCommentsListResult struct {
	Code string `json:"code"`
	Data ForumCommentPage `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

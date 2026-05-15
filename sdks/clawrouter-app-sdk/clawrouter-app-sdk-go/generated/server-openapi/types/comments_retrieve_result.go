package types

// Comments retrieve result schema exposed by Claw Router.
type CommentsRetrieveResult struct {
	Code string `json:"code"`
	Data ForumCommentDetail `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

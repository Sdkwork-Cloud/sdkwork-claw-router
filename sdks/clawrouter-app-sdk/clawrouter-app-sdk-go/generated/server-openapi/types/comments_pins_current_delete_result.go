package types

// Comments pins current delete result schema exposed by Claw Router.
type CommentsPinsCurrentDeleteResult struct {
	Code string `json:"code"`
	Data ForumCommentItem `json:"data"`
	Msg string `json:"msg"`
}

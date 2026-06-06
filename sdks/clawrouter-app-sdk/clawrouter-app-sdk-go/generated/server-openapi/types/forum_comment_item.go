package types

// Forum comment item schema exposed by Claw Router.
type ForumCommentItem struct {
	Author ForumAuthor `json:"author"`
	CommentId string `json:"commentId"`
	Content string `json:"content"`
	ContentId string `json:"contentId"`
	ContentType string `json:"contentType"`
	CreatedAt string `json:"createdAt"`
	IsTop bool `json:"isTop"`
	Likes string `json:"likes"`
	ParentId string `json:"parentId"`
	ReplyCount string `json:"replyCount"`
	Status string `json:"status"`
	UserId string `json:"userId"`
}

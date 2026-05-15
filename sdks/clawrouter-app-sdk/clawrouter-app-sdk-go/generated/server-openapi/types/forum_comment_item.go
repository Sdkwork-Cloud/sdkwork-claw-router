package types

// Forum comment item schema exposed by Claw Router.
type ForumCommentItem struct {
	Author ForumAuthor `json:"author"`
	CommentId string `json:"commentId"`
	Content string `json:"content"`
	ContentId int `json:"contentId"`
	ContentType string `json:"contentType"`
	CreatedAt string `json:"createdAt"`
	IsTop bool `json:"isTop"`
	Likes int `json:"likes"`
	ParentId int `json:"parentId"`
	ReplyCount int `json:"replyCount"`
	Status string `json:"status"`
	UserId int `json:"userId"`
}

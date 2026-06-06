package types

// Forum comment detail schema exposed by Claw Router.
type ForumCommentDetail struct {
	Author ForumAuthor `json:"author"`
	CommentId string `json:"commentId"`
	Content string `json:"content"`
	ContentId string `json:"contentId"`
	ContentType string `json:"contentType"`
	CreatedAt string `json:"createdAt"`
	DeviceInfo string `json:"deviceInfo"`
	IpAddress string `json:"ipAddress"`
	IsTop bool `json:"isTop"`
	Likes string `json:"likes"`
	ParentId string `json:"parentId"`
	Replies []ForumCommentItem `json:"replies"`
	ReplyCount string `json:"replyCount"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
	UserId string `json:"userId"`
}

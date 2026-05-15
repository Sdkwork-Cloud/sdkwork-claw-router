package types

// Forum comment detail schema exposed by Claw Router.
type ForumCommentDetail struct {
	Author ForumAuthor `json:"author"`
	CommentId string `json:"commentId"`
	Content string `json:"content"`
	ContentId int `json:"contentId"`
	ContentType string `json:"contentType"`
	CreatedAt string `json:"createdAt"`
	DeviceInfo string `json:"deviceInfo"`
	IpAddress string `json:"ipAddress"`
	IsTop bool `json:"isTop"`
	Likes int `json:"likes"`
	ParentId int `json:"parentId"`
	Replies []ForumCommentItem `json:"replies"`
	ReplyCount int `json:"replyCount"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
	UserId int `json:"userId"`
}

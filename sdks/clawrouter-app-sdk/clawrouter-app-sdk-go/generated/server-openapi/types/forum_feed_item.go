package types

// Forum feed item schema exposed by Claw Router.
type ForumFeedItem struct {
	Author ForumAuthor `json:"author"`
	CategoryId int `json:"categoryId"`
	CommentCount int `json:"commentCount"`
	Content string `json:"content"`
	ContentType string `json:"contentType"`
	CoverImage string `json:"coverImage"`
	CreatedAt string `json:"createdAt"`
	Id int `json:"id"`
	IsCollected bool `json:"isCollected"`
	IsHot bool `json:"isHot"`
	IsLiked bool `json:"isLiked"`
	IsRecommended bool `json:"isRecommended"`
	IsTop bool `json:"isTop"`
	LikeCount int `json:"likeCount"`
	ShareCount int `json:"shareCount"`
	Summary string `json:"summary"`
	Tags []string `json:"tags"`
	Title string `json:"title"`
	UpdatedAt string `json:"updatedAt"`
	ViewCount int `json:"viewCount"`
}

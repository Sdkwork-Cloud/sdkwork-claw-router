package types

// Forum feed item schema exposed by Claw Router.
type ForumFeedItem struct {
	Author ForumAuthor `json:"author"`
	CategoryId string `json:"categoryId"`
	CommentCount string `json:"commentCount"`
	Content string `json:"content"`
	ContentType string `json:"contentType"`
	Cover MediaResource `json:"cover"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	IsCollected bool `json:"isCollected"`
	IsHot bool `json:"isHot"`
	IsLiked bool `json:"isLiked"`
	IsRecommended bool `json:"isRecommended"`
	IsTop bool `json:"isTop"`
	LikeCount string `json:"likeCount"`
	ShareCount string `json:"shareCount"`
	Summary string `json:"summary"`
	Tags []string `json:"tags"`
	Title string `json:"title"`
	UpdatedAt string `json:"updatedAt"`
	ViewCount string `json:"viewCount"`
}

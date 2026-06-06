package types

// Forum create feed request schema exposed by Claw Router.
type ForumCreateFeedRequest struct {
	CategoryId string `json:"categoryId"`
	Content string `json:"content"`
	Images []MediaResource `json:"images"`
	Source string `json:"source"`
	SourceUrl string `json:"sourceUrl"`
	Tags []string `json:"tags"`
	Title string `json:"title"`
}

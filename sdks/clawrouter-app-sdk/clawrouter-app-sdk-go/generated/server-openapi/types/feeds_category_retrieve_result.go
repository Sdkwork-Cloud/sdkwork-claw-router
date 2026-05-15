package types

// Feeds category retrieve result schema exposed by Claw Router.
type FeedsCategoryRetrieveResult struct {
	Code string `json:"code"`
	Data ForumFeedItemList `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

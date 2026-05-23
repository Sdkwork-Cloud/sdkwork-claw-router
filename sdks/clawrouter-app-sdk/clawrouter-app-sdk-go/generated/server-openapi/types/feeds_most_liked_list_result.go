package types

// Feeds most liked list result schema exposed by Claw Router.
type FeedsMostLikedListResult struct {
	Code string `json:"code"`
	Data ForumFeedItemList `json:"data"`
	Msg string `json:"msg"`
}

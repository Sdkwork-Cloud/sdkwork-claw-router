package types

// Feeds most viewed list result schema exposed by Claw Router.
type FeedsMostViewedListResult struct {
	Code string `json:"code"`
	Data ForumFeedItemList `json:"data"`
	Msg string `json:"msg"`
}

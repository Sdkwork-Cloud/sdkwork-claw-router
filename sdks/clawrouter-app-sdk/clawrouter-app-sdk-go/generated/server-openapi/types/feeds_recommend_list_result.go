package types

// Feeds recommend list result schema exposed by Claw Router.
type FeedsRecommendListResult struct {
	Code string `json:"code"`
	Data ForumFeedItemList `json:"data"`
	Msg string `json:"msg"`
}

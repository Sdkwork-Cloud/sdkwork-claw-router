package types

// Feeds hot list result schema exposed by Claw Router.
type FeedsHotListResult struct {
	Code string `json:"code"`
	Data ForumFeedItemList `json:"data"`
	Msg string `json:"msg"`
}

package types

// Feeds list result schema exposed by Claw Router.
type FeedsListResult struct {
	Code string `json:"code"`
	Data ForumFeedItemList `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

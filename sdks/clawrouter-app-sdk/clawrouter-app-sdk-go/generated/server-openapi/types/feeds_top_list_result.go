package types

// Feeds top list result schema exposed by Claw Router.
type FeedsTopListResult struct {
	Code string `json:"code"`
	Data ForumFeedItemList `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

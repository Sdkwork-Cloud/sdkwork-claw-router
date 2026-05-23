package types

// Feeds retrieve result schema exposed by Claw Router.
type FeedsRetrieveResult struct {
	Code string `json:"code"`
	Data ForumFeedItem `json:"data"`
	Msg string `json:"msg"`
}

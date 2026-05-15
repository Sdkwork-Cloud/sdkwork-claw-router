package types

// Feeds create result schema exposed by Claw Router.
type FeedsCreateResult struct {
	Code string `json:"code"`
	Data ForumFeedItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

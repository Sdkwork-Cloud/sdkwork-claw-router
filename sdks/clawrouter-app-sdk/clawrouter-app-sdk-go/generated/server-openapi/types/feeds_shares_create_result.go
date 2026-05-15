package types

// Feeds shares create result schema exposed by Claw Router.
type FeedsSharesCreateResult struct {
	Code string `json:"code"`
	Data ForumFeedItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

package types

// Feeds likes current delete result schema exposed by Claw Router.
type FeedsLikesCurrentDeleteResult struct {
	Code string `json:"code"`
	Data ForumFeedItem `json:"data"`
	Msg string `json:"msg"`
}

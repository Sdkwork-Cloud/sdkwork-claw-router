package types

// Feeds likes create result schema exposed by Claw Router.
type FeedsLikesCreateResult struct {
	Code string `json:"code"`
	Data ForumFeedItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

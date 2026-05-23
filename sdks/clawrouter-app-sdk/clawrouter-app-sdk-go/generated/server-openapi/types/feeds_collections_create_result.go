package types

// Feeds collections create result schema exposed by Claw Router.
type FeedsCollectionsCreateResult struct {
	Code string `json:"code"`
	Data ForumFeedItem `json:"data"`
	Msg string `json:"msg"`
}

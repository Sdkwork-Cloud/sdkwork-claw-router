package types

// Feeds collections current delete result schema exposed by Claw Router.
type FeedsCollectionsCurrentDeleteResult struct {
	Code string `json:"code"`
	Data ForumFeedItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

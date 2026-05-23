package types

// Feeds collections current retrieve result schema exposed by Claw Router.
type FeedsCollectionsCurrentRetrieveResult struct {
	Code string `json:"code"`
	Data ForumBooleanResponse `json:"data"`
	Msg string `json:"msg"`
}

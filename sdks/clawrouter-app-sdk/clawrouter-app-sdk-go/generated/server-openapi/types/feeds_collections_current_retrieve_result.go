package types

// Feeds collections current retrieve result schema exposed by Claw Router.
type FeedsCollectionsCurrentRetrieveResult struct {
	Code string `json:"code"`
	Data ForumBooleanResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

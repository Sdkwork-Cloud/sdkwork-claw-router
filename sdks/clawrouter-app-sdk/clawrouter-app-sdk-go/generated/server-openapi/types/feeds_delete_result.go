package types

// Feeds delete result schema exposed by Claw Router.
type FeedsDeleteResult struct {
	Code string `json:"code"`
	Data ForumBooleanResponse `json:"data"`
	Msg string `json:"msg"`
}

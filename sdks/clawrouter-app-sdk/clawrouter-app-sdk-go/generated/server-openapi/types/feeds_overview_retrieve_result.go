package types

// Feeds overview retrieve result schema exposed by Claw Router.
type FeedsOverviewRetrieveResult struct {
	Code string `json:"code"`
	Data ForumOverviewResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

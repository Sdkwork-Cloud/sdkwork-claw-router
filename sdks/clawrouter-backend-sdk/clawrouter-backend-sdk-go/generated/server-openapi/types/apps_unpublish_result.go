package types

// Apps unpublish result schema exposed by Claw Router.
type AppsUnpublishResult struct {
	Code string `json:"code"`
	Data AdminAppMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

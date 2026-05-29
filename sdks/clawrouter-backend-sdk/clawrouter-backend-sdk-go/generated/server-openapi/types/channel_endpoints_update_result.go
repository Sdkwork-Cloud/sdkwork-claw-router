package types

// Channel endpoints update result schema exposed by Claw Router.
type ChannelEndpointsUpdateResult struct {
	Code string `json:"code"`
	Data AdminChannelEndpointMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

package types

// Channel endpoints create result schema exposed by Claw Router.
type ChannelEndpointsCreateResult struct {
	Code string `json:"code"`
	Data AdminChannelEndpointMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

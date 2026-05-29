package types

// Channel endpoints list result schema exposed by Claw Router.
type ChannelEndpointsListResult struct {
	Code string `json:"code"`
	Data AdminChannelEndpointsResponse `json:"data"`
	Msg string `json:"msg"`
}

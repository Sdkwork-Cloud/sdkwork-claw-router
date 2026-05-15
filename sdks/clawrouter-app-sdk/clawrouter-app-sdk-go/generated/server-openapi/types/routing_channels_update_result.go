package types

// Routing channels update result schema exposed by Claw Router.
type RoutingChannelsUpdateResult struct {
	Code string `json:"code"`
	Data RoutingChannelMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

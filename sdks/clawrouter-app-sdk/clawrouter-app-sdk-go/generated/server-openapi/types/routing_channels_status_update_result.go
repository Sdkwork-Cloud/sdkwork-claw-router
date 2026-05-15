package types

// Routing channels status update result schema exposed by Claw Router.
type RoutingChannelsStatusUpdateResult struct {
	Code string `json:"code"`
	Data RoutingChannelMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

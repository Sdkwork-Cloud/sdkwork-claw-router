package types

// Routing channels create result schema exposed by Claw Router.
type RoutingChannelsCreateResult struct {
	Code string `json:"code"`
	Data RoutingChannelMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

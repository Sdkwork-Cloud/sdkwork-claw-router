package types

// Routing channels delete result schema exposed by Claw Router.
type RoutingChannelsDeleteResult struct {
	Code string `json:"code"`
	Data RoutingChannelDeleteResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

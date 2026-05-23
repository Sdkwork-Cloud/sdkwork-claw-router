package types

// Routing channels delete result schema exposed by Claw Router.
type RoutingChannelsDeleteResult struct {
	Code string `json:"code"`
	Data RoutingChannelDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}

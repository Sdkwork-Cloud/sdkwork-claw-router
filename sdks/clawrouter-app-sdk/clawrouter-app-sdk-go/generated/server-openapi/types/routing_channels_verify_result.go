package types

// Routing channels verify result schema exposed by Claw Router.
type RoutingChannelsVerifyResult struct {
	Code string `json:"code"`
	Data RoutingChannelTestResponse `json:"data"`
	Msg string `json:"msg"`
}

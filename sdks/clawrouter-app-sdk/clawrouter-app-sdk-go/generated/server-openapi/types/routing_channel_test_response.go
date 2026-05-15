package types

// Routing channel test response schema exposed by Claw Router.
type RoutingChannelTestResponse struct {
	ChannelId string `json:"channelId"`
	Item RoutingChannelItem `json:"item"`
	Latency string `json:"latency"`
	Status string `json:"status"`
	Success bool `json:"success"`
}

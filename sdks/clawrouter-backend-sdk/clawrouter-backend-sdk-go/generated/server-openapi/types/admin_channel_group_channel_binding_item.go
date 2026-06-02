package types

// Admin channel group channel binding item schema exposed by Claw Router.
type AdminChannelGroupChannelBindingItem struct {
	Capabilities []string `json:"capabilities"`
	ChannelCode string `json:"channelCode"`
	ChannelGroupId string `json:"channelGroupId"`
	ChannelId string `json:"channelId"`
	ChannelName string `json:"channelName"`
	HealthStatus string `json:"healthStatus"`
	Id string `json:"id"`
	ModelScope []string `json:"modelScope"`
	Models []string `json:"models"`
	Priority int `json:"priority"`
	ProviderCode string `json:"providerCode"`
	ProviderName string `json:"providerName"`
	Status string `json:"status"`
	Weight int `json:"weight"`
}

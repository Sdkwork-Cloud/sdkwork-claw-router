package types

// Admin access group channel binding input schema exposed by Claw Router.
type AdminAccessGroupChannelBindingInput struct {
	Capabilities []string `json:"capabilities"`
	ChannelId string `json:"channelId"`
	ModelScope []string `json:"modelScope"`
	Priority int `json:"priority"`
	Status string `json:"status"`
	Weight int `json:"weight"`
}

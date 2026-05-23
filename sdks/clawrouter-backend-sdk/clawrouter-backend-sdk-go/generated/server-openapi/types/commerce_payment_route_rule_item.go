package types

// Commerce payment route rule item schema exposed by Claw Router.
type CommercePaymentRouteRuleItem struct {
	ChannelId string `json:"channelId"`
	CountryCode string `json:"countryCode"`
	CreatedAt string `json:"createdAt"`
	CurrencyCode string `json:"currencyCode"`
	FallbackChannelId string `json:"fallbackChannelId"`
	FallbackEnabled bool `json:"fallbackEnabled"`
	Id string `json:"id"`
	MethodCode string `json:"methodCode"`
	Priority int `json:"priority"`
	RuleNo string `json:"ruleNo"`
	SceneCode string `json:"sceneCode"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
}

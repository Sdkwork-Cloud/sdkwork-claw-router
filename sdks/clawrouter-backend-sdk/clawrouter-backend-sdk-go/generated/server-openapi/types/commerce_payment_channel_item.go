package types

// Commerce payment channel item schema exposed by Claw Router.
type CommercePaymentChannelItem struct {
	ChannelNo string `json:"channelNo"`
	CountryCode string `json:"countryCode"`
	CreatedAt string `json:"createdAt"`
	CurrencyCode string `json:"currencyCode"`
	Id string `json:"id"`
	MethodCode string `json:"methodCode"`
	Priority int `json:"priority"`
	ProviderAccountId string `json:"providerAccountId"`
	ProviderCode string `json:"providerCode"`
	SceneCode string `json:"sceneCode"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
}

package types

// Persisted channel regional endpoint snapshot returned by the backend.
type AdminChannelEndpointItem struct {
	ApiEndpointCode string `json:"apiEndpointCode"`
	BaseUrl string `json:"baseUrl"`
	ChannelCode string `json:"channelCode"`
	ChannelId string `json:"channelId"`
	ChannelType string `json:"channelType"`
	EffectiveFrom string `json:"effectiveFrom"`
	EffectiveTo string `json:"effectiveTo"`
	HealthStatus string `json:"healthStatus"`
	Id string `json:"id"`
	Priority int `json:"priority"`
	ProviderCode string `json:"providerCode"`
	RegionCode string `json:"regionCode"`
	Status string `json:"status"`
	VendorCode string `json:"vendorCode"`
	Weight int `json:"weight"`
}

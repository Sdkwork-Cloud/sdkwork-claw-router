package types

// Routing channel item schema exposed by Claw Router.
type RoutingChannelItem struct {
	AccessType string `json:"accessType"`
	ApiKey string `json:"apiKey"`
	Balance string `json:"balance"`
	BaseUrl string `json:"baseUrl"`
	Capabilities []string `json:"capabilities"`
	Errors int `json:"errors"`
	Id string `json:"id"`
	IsMultimodal bool `json:"isMultimodal"`
	Latency string `json:"latency"`
	Models []string `json:"models"`
	Name string `json:"name"`
	Protocol string `json:"protocol"`
	Provider string `json:"provider"`
	ProviderCode string `json:"providerCode"`
	Rpm int `json:"rpm"`
	Status string `json:"status"`
	Vendor string `json:"vendor"`
	Weight int `json:"weight"`
}

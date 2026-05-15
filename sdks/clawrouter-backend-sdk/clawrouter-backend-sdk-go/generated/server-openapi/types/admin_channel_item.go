package types

// Persisted channel snapshot returned after the provider health probe. Secret refs and tokens are not returned.
type AdminChannelItem struct {
	AccessType string `json:"accessType"`
	Balance string `json:"balance"`
	BaseUrl string `json:"baseUrl"`
	Capabilities []string `json:"capabilities"`
	Errors int `json:"errors"`
	Id string `json:"id"`
	IsMultimodal bool `json:"isMultimodal"`
	Models []string `json:"models"`
	Name string `json:"name"`
	Protocol string `json:"protocol"`
	RetryPolicy ProviderRetryPolicy `json:"retryPolicy"`
	SecretRef string `json:"secretRef"`
	Status string `json:"status"`
	TimeoutMs int `json:"timeoutMs"`
	Vendor string `json:"vendor"`
	Weight int `json:"weight"`
}

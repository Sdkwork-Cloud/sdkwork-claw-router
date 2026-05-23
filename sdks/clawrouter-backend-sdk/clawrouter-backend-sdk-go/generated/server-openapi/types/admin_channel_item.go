package types

// Persisted channel snapshot returned after the provider health probe. Admin management responses may return the stored plaintext provider API key for channel account relay operations.
type AdminChannelItem struct {
	AccessType string `json:"accessType"`
	ApiKey string `json:"apiKey"`
	Balance string `json:"balance"`
	BaseUrl string `json:"baseUrl"`
	Capabilities []string `json:"capabilities"`
	CircuitBreakerPolicy ProviderCircuitBreakerPolicy `json:"circuitBreakerPolicy"`
	CreatedAt string `json:"createdAt"`
	Errors int `json:"errors"`
	ExpiresAt string `json:"expiresAt"`
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

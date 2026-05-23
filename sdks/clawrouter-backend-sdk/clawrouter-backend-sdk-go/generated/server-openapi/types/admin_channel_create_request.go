package types

// Admin channel create request schema exposed by Claw Router.
type AdminChannelCreateRequest struct {
	AccessType string `json:"accessType"`
	ApiKey string `json:"apiKey"`
	BaseUrl string `json:"baseUrl"`
	Capabilities []string `json:"capabilities"`
	CircuitBreakerPolicy ProviderCircuitBreakerPolicy `json:"circuitBreakerPolicy"`
	ExpiresAt string `json:"expiresAt"`
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

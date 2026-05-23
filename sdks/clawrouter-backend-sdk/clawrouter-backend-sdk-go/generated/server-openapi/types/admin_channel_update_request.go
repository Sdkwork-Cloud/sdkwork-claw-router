package types

// Admin channel update request schema exposed by Claw Router.
type AdminChannelUpdateRequest struct {
	AccessType string `json:"accessType"`
	ApiKey string `json:"apiKey"`
	BaseUrl string `json:"baseUrl"`
	Capabilities []string `json:"capabilities"`
	CircuitBreakerPolicy ProviderCircuitBreakerPolicy `json:"circuitBreakerPolicy"`
	ExpiresAt string `json:"expiresAt"`
	Id string `json:"id"`
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

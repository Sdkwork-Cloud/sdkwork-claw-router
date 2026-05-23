package types

// Create routing channel request schema exposed by Claw Router.
type CreateRoutingChannelRequest struct {
	AccessType string `json:"accessType"`
	BaseUrl string `json:"baseUrl"`
	Capabilities []string `json:"capabilities"`
	CircuitBreakerPolicy ProviderCircuitBreakerPolicy `json:"circuitBreakerPolicy"`
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

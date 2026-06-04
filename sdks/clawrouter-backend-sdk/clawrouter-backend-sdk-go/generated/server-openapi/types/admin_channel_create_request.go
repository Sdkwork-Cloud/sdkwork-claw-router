package types

// Admin channel create request schema exposed by Claw Router.
type AdminChannelCreateRequest struct {
	AccessType string `json:"accessType"`
	Capabilities []string `json:"capabilities"`
	ChannelType string `json:"channelType"`
	CircuitBreakerPolicy ProviderCircuitBreakerPolicy `json:"circuitBreakerPolicy"`
	CredentialRotation string `json:"credentialRotation"`
	Credentials []AdminChannelCredentialInput `json:"credentials"`
	ExpiresAt string `json:"expiresAt"`
	Models []string `json:"models"`
	Name string `json:"name"`
	Protocol string `json:"protocol"`
	ResourceCodes []string `json:"resourceCodes"`
	RetryPolicy ProviderRetryPolicy `json:"retryPolicy"`
	Status string `json:"status"`
	TimeoutMs int `json:"timeoutMs"`
	Vendor string `json:"vendor"`
	Weight int `json:"weight"`
}

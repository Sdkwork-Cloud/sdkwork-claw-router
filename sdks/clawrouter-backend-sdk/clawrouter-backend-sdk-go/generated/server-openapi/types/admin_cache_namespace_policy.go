package types

// Admin cache namespace policy schema exposed by Claw Router.
type AdminCacheNamespacePolicy struct {
	Consistency string `json:"consistency"`
	Enabled bool `json:"enabled"`
	FailureMode string `json:"failureMode"`
	InstanceName string `json:"instanceName"`
	JitterPercent int `json:"jitterPercent"`
	Namespace string `json:"namespace"`
	Scope string `json:"scope"`
	Sensitivity string `json:"sensitivity"`
	StaleWhileRevalidateSeconds int `json:"staleWhileRevalidateSeconds"`
	Tags []string `json:"tags"`
	TtlSeconds int `json:"ttlSeconds"`
}

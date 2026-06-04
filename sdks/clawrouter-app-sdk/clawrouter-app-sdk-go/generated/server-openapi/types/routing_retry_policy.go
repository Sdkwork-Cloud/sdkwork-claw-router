package types

// Routing retry policy schema exposed by Claw Router.
type RoutingRetryPolicy struct {
	BackoffMs int `json:"backoffMs"`
	MaxAttempts int `json:"maxAttempts"`
	RetryableStatusCodes []int `json:"retryableStatusCodes"`
}

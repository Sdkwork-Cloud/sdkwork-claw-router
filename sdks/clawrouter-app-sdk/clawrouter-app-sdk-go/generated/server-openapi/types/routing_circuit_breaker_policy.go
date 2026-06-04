package types

// Routing circuit breaker policy schema exposed by Claw Router.
type RoutingCircuitBreakerPolicy struct {
	FailureThreshold int `json:"failureThreshold"`
}

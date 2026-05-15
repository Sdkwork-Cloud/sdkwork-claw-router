package types

// Routing strategy update result schema exposed by Claw Router.
type RoutingStrategyUpdateResult struct {
	Code string `json:"code"`
	Data UpdateRoutingStrategyResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

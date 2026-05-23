package types

// Routing strategy list result schema exposed by Claw Router.
type RoutingStrategyListResult struct {
	Code string `json:"code"`
	Data RoutingStrategySnapshot `json:"data"`
	Msg string `json:"msg"`
}

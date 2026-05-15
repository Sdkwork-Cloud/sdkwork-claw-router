package types

// Routing request traces list result schema exposed by Claw Router.
type RoutingRequestTracesListResult struct {
	Code string `json:"code"`
	Data RoutingRequestTracesResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

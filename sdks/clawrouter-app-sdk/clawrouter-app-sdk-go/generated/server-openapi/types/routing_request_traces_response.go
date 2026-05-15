package types

// Routing request traces response schema exposed by Claw Router.
type RoutingRequestTracesResponse struct {
	Items []map[string]interface{} `json:"items"`
}

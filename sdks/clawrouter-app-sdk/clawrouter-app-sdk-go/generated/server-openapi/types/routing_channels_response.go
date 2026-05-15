package types

// Routing channels response schema exposed by Claw Router.
type RoutingChannelsResponse struct {
	Items []map[string]interface{} `json:"items"`
}

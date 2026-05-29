package types

// Admin channel endpoints response schema exposed by Claw Router.
type AdminChannelEndpointsResponse struct {
	Items []AdminChannelEndpointItem `json:"items"`
}

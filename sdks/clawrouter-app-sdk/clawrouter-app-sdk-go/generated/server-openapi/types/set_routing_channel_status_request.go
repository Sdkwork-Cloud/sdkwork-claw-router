package types

// Set routing channel status request schema exposed by Claw Router.
type SetRoutingChannelStatusRequest struct {
	Status string `json:"status"`
}

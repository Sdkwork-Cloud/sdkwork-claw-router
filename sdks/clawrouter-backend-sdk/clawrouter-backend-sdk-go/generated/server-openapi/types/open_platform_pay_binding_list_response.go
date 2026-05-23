package types

// Open platform pay binding list response schema exposed by Claw Router.
type OpenPlatformPayBindingListResponse struct {
	Items []OpenPlatformPayBindingItem `json:"items"`
}

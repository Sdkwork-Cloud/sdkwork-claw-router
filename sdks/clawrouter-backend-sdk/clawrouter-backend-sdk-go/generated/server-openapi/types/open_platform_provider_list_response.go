package types

// Open platform provider list response schema exposed by Claw Router.
type OpenPlatformProviderListResponse struct {
	Items []OpenPlatformProviderItem `json:"items"`
}

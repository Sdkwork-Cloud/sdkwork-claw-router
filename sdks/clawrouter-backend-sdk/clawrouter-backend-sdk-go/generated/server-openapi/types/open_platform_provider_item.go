package types

// Open platform provider item schema exposed by Claw Router.
type OpenPlatformProviderItem struct {
	Id string `json:"id"`
	Name string `json:"name"`
	Provider string `json:"provider"`
	Status string `json:"status"`
}

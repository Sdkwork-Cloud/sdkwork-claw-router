package types

// Create routing channel request schema exposed by Claw Router.
type CreateRoutingChannelRequest struct {
	AccessType string `json:"accessType"`
	BaseUrl string `json:"baseUrl"`
	Capabilities []string `json:"capabilities"`
	Models []string `json:"models"`
	Name string `json:"name"`
	Protocol string `json:"protocol"`
	SecretRef string `json:"secretRef"`
	Status string `json:"status"`
	Vendor string `json:"vendor"`
	Weight int `json:"weight"`
}

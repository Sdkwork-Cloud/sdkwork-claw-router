package types

// Admin channel endpoint update request schema exposed by Claw Router.
type AdminChannelEndpointUpdateRequest struct {
	ApiEndpointCode string `json:"apiEndpointCode"`
	BaseUrl string `json:"baseUrl"`
	EffectiveFrom string `json:"effectiveFrom"`
	EffectiveTo string `json:"effectiveTo"`
	Priority int `json:"priority"`
	RegionCode string `json:"regionCode"`
	Status string `json:"status"`
	VendorCode string `json:"vendorCode"`
	Weight int `json:"weight"`
}

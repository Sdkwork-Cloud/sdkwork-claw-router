package types

// Admin site model item schema exposed by Claw Router.
type AdminSiteModelItem struct {
	Capabilities []string `json:"capabilities"`
	ConsecutiveErrorCount int `json:"consecutiveErrorCount"`
	ContextTokens int `json:"contextTokens"`
	DisplayName string `json:"displayName"`
	HealthStatus string `json:"healthStatus"`
	Id string `json:"id"`
	LastLatencyMs int `json:"lastLatencyMs"`
	LastSyncAt string `json:"lastSyncAt"`
	MaxInputTokens int `json:"maxInputTokens"`
	MaxOutputTokens int `json:"maxOutputTokens"`
	Modality string `json:"modality"`
	ModelCode string `json:"modelCode"`
	ModelName string `json:"modelName"`
	ProviderModel string `json:"providerModel"`
	ProviderNativeModel string `json:"providerNativeModel"`
	ServiceType string `json:"serviceType"`
	SiteCode string `json:"siteCode"`
	SiteId string `json:"siteId"`
	SiteServiceCode string `json:"siteServiceCode"`
	SiteServiceId string `json:"siteServiceId"`
	Status string `json:"status"`
	SupportsJsonSchema bool `json:"supportsJsonSchema"`
	SupportsStreaming bool `json:"supportsStreaming"`
	SupportsTools bool `json:"supportsTools"`
	VendorCode string `json:"vendorCode"`
}

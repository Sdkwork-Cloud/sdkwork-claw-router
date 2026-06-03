package types

// Admin site model update request schema exposed by Claw Router.
type AdminSiteModelUpdateRequest struct {
	Capabilities []string `json:"capabilities"`
	ContextTokens int `json:"contextTokens"`
	DisplayName string `json:"displayName"`
	MaxInputTokens int `json:"maxInputTokens"`
	MaxOutputTokens int `json:"maxOutputTokens"`
	Modality string `json:"modality"`
	ModelCode string `json:"modelCode"`
	ModelName string `json:"modelName"`
	ProviderModel string `json:"providerModel"`
	ProviderNativeModel string `json:"providerNativeModel"`
	Status string `json:"status"`
	SupportsJsonSchema bool `json:"supportsJsonSchema"`
	SupportsStreaming bool `json:"supportsStreaming"`
	SupportsTools bool `json:"supportsTools"`
	VendorCode string `json:"vendorCode"`
}

package types

// Admin ai model create request schema exposed by Claw Router.
type AdminAiModelCreateRequest struct {
	ApiFormat string `json:"apiFormat"`
	CapabilityIntro string `json:"capabilityIntro"`
	ContextTokens string `json:"contextTokens"`
	Description string `json:"description"`
	DisplayName string `json:"displayName"`
	InputModalities []string `json:"inputModalities"`
	Limitations []string `json:"limitations"`
	MaxOutputTokens int `json:"maxOutputTokens"`
	Modalities []string `json:"modalities"`
	Model string `json:"model"`
	OutputModalities []string `json:"outputModalities"`
	RegionPrices []AdminAiModelRegionPrice `json:"regionPrices"`
	ReleaseStage int `json:"releaseStage"`
	ReplacementModel string `json:"replacementModel"`
	RoutingState int `json:"routingState"`
	ShelfState int `json:"shelfState"`
	SupportedLanguages []string `json:"supportedLanguages"`
	SupportsJsonSchema bool `json:"supportsJsonSchema"`
	SupportsStreaming bool `json:"supportsStreaming"`
	SupportsTools bool `json:"supportsTools"`
	TrainingDataCutoff string `json:"trainingDataCutoff"`
	Type string `json:"type"`
	UseCases []string `json:"useCases"`
	VendorId string `json:"vendorId"`
}

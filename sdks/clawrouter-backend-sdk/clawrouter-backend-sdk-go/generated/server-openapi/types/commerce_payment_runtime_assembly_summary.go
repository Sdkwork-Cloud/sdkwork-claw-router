package types

// Commerce payment runtime assembly summary schema exposed by Claw Router.
type CommercePaymentRuntimeAssemblySummary struct {
	Failed int `json:"failed"`
	FailedProviderCodes []string `json:"failedProviderCodes"`
	Registered int `json:"registered"`
	RegisteredProviderCodes []string `json:"registeredProviderCodes"`
	Skipped int `json:"skipped"`
	SkippedProviderCodes []string `json:"skippedProviderCodes"`
	Total int `json:"total"`
}

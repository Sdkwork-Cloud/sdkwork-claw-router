package types

// Commerce payment runtime assembly summary schema exposed by Claw Router.
type CommercePaymentRuntimeAssemblySummary struct {
	Failed string `json:"failed"`
	FailedProviderCodes []string `json:"failedProviderCodes"`
	Registered string `json:"registered"`
	RegisteredProviderCodes []string `json:"registeredProviderCodes"`
	Skipped string `json:"skipped"`
	SkippedProviderCodes []string `json:"skippedProviderCodes"`
	Total string `json:"total"`
}

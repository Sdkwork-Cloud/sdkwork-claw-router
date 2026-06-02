package types

// Commerce recharge settings response schema exposed by Claw Router.
type CommerceRechargeSettingsResponse struct {
	BaseCurrencyCode string `json:"baseCurrencyCode"`
	BasePointsPerCny string `json:"basePointsPerCny"`
	CurrencyToCnyRates map[string]string `json:"currencyToCnyRates"`
	PreviewExamples map[string]map[string]map[string]interface{} `json:"previewExamples"`
}

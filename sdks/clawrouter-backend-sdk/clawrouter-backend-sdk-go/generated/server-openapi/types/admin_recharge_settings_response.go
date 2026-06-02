package types

// Admin recharge settings response schema exposed by Claw Router.
type AdminRechargeSettingsResponse struct {
	BaseCurrencyCode string `json:"baseCurrencyCode"`
	BasePointsPerCny string `json:"basePointsPerCny"`
	CurrencyToCnyRates map[string]string `json:"currencyToCnyRates"`
}

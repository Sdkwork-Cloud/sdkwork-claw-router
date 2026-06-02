package types

// Commerce recharge settings update request schema exposed by Claw Router.
type CommerceRechargeSettingsUpdateRequest struct {
	BaseCurrencyCode string `json:"baseCurrencyCode"`
	BasePointsPerCny string `json:"basePointsPerCny"`
	CurrencyToCnyRates map[string]string `json:"currencyToCnyRates"`
}

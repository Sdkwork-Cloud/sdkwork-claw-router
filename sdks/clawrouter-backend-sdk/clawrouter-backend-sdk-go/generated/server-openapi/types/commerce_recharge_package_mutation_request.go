package types

// Commerce recharge package mutation request schema exposed by Claw Router.
type CommerceRechargePackageMutationRequest struct {
	BonusPoints string `json:"bonusPoints"`
	CurrencyCode string `json:"currencyCode"`
	PriceAmount string `json:"priceAmount"`
	Status string `json:"status"`
}

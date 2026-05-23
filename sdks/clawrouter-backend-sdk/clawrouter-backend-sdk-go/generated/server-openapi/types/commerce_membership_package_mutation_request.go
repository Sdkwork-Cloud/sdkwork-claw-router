package types

// Commerce membership package mutation request schema exposed by Claw Router.
type CommerceMembershipPackageMutationRequest struct {
	Code string `json:"code"`
	CurrencyCode string `json:"currencyCode"`
	DurationDays int `json:"durationDays"`
	Name string `json:"name"`
	PackageGroupId string `json:"packageGroupId"`
	PlanId string `json:"planId"`
	PriceAmount string `json:"priceAmount"`
	Status string `json:"status"`
}

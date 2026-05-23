package types

// Commerce membership package group mutation request schema exposed by Claw Router.
type CommerceMembershipPackageGroupMutationRequest struct {
	BillingCycle string `json:"billingCycle"`
	Code string `json:"code"`
	Description string `json:"description"`
	DurationDays int `json:"durationDays"`
	Name string `json:"name"`
	SortWeight int `json:"sortWeight"`
	Status string `json:"status"`
}

package types

// Commerce membership package group mutation request schema exposed by Claw Router.
type CommerceMembershipPackageGroupMutationRequest struct {
	BillingCycle string `json:"billingCycle"`
	Code string `json:"code"`
	Description string `json:"description"`
	DurationDays string `json:"durationDays"`
	Name string `json:"name"`
	SortWeight string `json:"sortWeight"`
	Status string `json:"status"`
}

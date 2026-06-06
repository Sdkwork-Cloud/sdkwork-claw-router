package types

// Commerce membership plan mutation request schema exposed by Claw Router.
type CommerceMembershipPlanMutationRequest struct {
	Benefits []CommerceMembershipBenefitMutationRequest `json:"benefits"`
	Code string `json:"code"`
	Name string `json:"name"`
	Rank string `json:"rank"`
	Status string `json:"status"`
}

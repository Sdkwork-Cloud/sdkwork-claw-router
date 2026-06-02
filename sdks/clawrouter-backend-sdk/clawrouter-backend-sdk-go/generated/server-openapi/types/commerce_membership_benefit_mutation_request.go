package types

// Commerce membership benefit mutation request schema exposed by Claw Router.
type CommerceMembershipBenefitMutationRequest struct {
	BenefitKey string `json:"benefitKey"`
	Claimed bool `json:"claimed"`
	Description string `json:"description"`
	Icon MediaResource `json:"icon"`
	Id int `json:"id"`
	Name string `json:"name"`
	Type string `json:"type"`
	UsageLimit int `json:"usageLimit"`
	UsedCount int `json:"usedCount"`
}

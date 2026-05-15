package types

// Commerce vip benefit item schema exposed by Claw Router.
type CommerceVipBenefitItem struct {
	BenefitType string `json:"benefitType"`
	Code string `json:"code"`
	Id string `json:"id"`
	Name string `json:"name"`
	Status string `json:"status"`
}

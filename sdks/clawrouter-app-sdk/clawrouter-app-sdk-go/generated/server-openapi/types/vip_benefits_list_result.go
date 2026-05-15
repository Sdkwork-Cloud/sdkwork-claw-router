package types

// Vip benefits list result schema exposed by Claw Router.
type VipBenefitsListResult struct {
	Code string `json:"code"`
	Data CommerceVipBenefitsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

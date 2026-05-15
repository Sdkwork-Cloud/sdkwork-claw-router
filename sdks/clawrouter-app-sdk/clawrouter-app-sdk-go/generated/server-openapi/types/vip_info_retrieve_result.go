package types

// Vip info retrieve result schema exposed by Claw Router.
type VipInfoRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceVipInfoResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

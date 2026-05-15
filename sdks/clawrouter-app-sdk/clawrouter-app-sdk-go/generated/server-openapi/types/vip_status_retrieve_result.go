package types

// Vip status retrieve result schema exposed by Claw Router.
type VipStatusRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceVipInfoResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

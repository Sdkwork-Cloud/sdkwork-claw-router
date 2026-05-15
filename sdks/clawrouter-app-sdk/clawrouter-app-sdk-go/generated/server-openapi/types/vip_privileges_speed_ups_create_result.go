package types

// Vip privileges speed ups create result schema exposed by Claw Router.
type VipPrivilegesSpeedUpsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

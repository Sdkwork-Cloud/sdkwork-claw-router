package types

// Vip privileges usage retrieve result schema exposed by Claw Router.
type VipPrivilegesUsageRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceVipPrivilegeUsageResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

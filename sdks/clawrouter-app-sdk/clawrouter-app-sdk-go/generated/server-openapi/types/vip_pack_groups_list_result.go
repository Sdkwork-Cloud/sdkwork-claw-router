package types

// Vip pack groups list result schema exposed by Claw Router.
type VipPackGroupsListResult struct {
	Code string `json:"code"`
	Data CommerceVipPackGroupsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

package types

// Vip pack groups retrieve result schema exposed by Claw Router.
type VipPackGroupsRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceVipPackGroupItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

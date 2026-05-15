package types

// Vip pack groups packs list result schema exposed by Claw Router.
type VipPackGroupsPacksListResult struct {
	Code string `json:"code"`
	Data CommerceVipPackGroupPacksResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

package types

// Vip packs retrieve result schema exposed by Claw Router.
type VipPacksRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceVipPackItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

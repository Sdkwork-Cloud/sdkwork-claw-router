package types

// Vip purchase upgrade result schema exposed by Claw Router.
type VipPurchaseUpgradeResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

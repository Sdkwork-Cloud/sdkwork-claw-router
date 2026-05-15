package types

// Vip purchase renew result schema exposed by Claw Router.
type VipPurchaseRenewResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

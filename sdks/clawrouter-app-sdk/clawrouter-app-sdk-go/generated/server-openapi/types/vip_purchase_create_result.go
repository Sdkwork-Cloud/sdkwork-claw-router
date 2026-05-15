package types

// Vip purchase create result schema exposed by Claw Router.
type VipPurchaseCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

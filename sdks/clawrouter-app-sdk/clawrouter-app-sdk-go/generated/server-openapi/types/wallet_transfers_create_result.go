package types

// Wallet transfers create result schema exposed by Claw Router.
type WalletTransfersCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

package types

// Wallet topups create result schema exposed by Claw Router.
type WalletTopupsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

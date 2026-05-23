package types

// Wallet exchanges create result schema exposed by Claw Router.
type WalletExchangesCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

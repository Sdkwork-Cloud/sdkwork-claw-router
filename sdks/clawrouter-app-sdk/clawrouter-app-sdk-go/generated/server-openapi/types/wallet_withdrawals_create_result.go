package types

// Wallet withdrawals create result schema exposed by Claw Router.
type WalletWithdrawalsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

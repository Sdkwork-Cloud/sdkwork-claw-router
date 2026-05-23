package types

// Wallet adjustments create result schema exposed by Claw Router.
type WalletAdjustmentsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

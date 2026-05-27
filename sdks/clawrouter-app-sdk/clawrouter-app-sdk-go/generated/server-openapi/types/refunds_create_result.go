package types

// Refunds create result schema exposed by Claw Router.
type RefundsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

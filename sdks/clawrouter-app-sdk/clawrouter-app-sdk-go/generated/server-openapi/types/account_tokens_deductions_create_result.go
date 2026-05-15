package types

// Account tokens deductions create result schema exposed by Claw Router.
type AccountTokensDeductionsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

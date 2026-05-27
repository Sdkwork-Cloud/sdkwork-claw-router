package types

// Orders cancellations create result schema exposed by Claw Router.
type OrdersCancellationsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

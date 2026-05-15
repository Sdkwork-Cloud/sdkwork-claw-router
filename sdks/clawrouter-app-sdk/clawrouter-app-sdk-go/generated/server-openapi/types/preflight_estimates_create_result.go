package types

// Preflight estimates create result schema exposed by Claw Router.
type PreflightEstimatesCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

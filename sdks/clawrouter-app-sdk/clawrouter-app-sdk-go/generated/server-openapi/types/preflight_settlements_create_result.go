package types

// Preflight settlements create result schema exposed by Claw Router.
type PreflightSettlementsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

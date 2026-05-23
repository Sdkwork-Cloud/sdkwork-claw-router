package types

// Preflight settlements create result schema exposed by Claw Router.
type PreflightSettlementsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

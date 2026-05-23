package types

// Preflight prechecks create result schema exposed by Claw Router.
type PreflightPrechecksCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}

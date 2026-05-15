package types

// Preflight releases create result schema exposed by Claw Router.
type PreflightReleasesCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

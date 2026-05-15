package types

// Rate limits ip create result schema exposed by Claw Router.
type RateLimitsIpCreateResult struct {
	Code string `json:"code"`
	Data AdminRateLimitMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

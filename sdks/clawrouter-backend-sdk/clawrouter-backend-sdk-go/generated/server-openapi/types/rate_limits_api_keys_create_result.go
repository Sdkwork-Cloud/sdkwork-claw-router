package types

// Rate limits api keys create result schema exposed by Claw Router.
type RateLimitsApiKeysCreateResult struct {
	Code string `json:"code"`
	Data AdminRateLimitMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

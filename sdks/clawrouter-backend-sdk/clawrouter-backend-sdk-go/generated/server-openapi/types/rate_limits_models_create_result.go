package types

// Rate limits models create result schema exposed by Claw Router.
type RateLimitsModelsCreateResult struct {
	Code string `json:"code"`
	Data AdminRateLimitMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

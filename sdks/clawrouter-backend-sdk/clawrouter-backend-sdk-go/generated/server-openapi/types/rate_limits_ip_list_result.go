package types

// Rate limits ip list result schema exposed by Claw Router.
type RateLimitsIpListResult struct {
	Code string `json:"code"`
	Data AdminIpLimitsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

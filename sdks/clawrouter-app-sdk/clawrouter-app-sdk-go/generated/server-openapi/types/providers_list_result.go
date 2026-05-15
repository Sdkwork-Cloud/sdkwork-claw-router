package types

// Providers list result schema exposed by Claw Router.
type ProvidersListResult struct {
	Code string `json:"code"`
	Data ProvidersResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

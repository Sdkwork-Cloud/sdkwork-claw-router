package types

// Providers list result schema exposed by Claw Router.
type ProvidersListResult struct {
	Code string `json:"code"`
	Data OpenPlatformProviderListResponse `json:"data"`
	Msg string `json:"msg"`
}

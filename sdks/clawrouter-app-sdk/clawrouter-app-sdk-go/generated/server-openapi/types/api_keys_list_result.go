package types

// Api keys list result schema exposed by Claw Router.
type ApiKeysListResult struct {
	Code string `json:"code"`
	Data AppApiKeyListResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

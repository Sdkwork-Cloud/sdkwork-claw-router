package types

// Api keys create result schema exposed by Claw Router.
type ApiKeysCreateResult struct {
	Code string `json:"code"`
	Data CreateApiKeyResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

package types

// Provider secrets delete result schema exposed by Claw Router.
type ProviderSecretsDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

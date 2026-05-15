package types

// Provider secrets list result schema exposed by Claw Router.
type ProviderSecretsListResult struct {
	Code string `json:"code"`
	Data AdminProviderSecretsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

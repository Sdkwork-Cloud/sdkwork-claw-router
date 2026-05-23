package types

// Apps retrieve result schema exposed by Claw Router.
type AppsRetrieveResult struct {
	Code string `json:"code"`
	Data AdminAppMutationResponse `json:"data"`
	Msg string `json:"msg"`
}

package types

// Oauth sessions create result schema exposed by Claw Router.
type OauthSessionsCreateResult struct {
	Code string `json:"code"`
	Data IamSessionResponse `json:"data"`
	Msg string `json:"msg"`
}

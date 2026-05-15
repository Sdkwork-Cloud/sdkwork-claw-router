package types

// Oauth authorization urls retrieve result schema exposed by Claw Router.
type OauthAuthorizationUrlsRetrieveResult struct {
	Code string `json:"code"`
	Data IamOauthAuthorizationUrlResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

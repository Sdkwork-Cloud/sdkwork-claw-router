package types

// Iam oauth authorization url response schema exposed by Claw Router.
type IamOauthAuthorizationUrlResponse struct {
	AuthUrl string `json:"authUrl"`
}

package types

// Iam session response schema exposed by Claw Router.
type IamSessionResponse struct {
	AccessToken string `json:"accessToken"`
	AuthToken string `json:"authToken"`
	Context IamAppContext `json:"context"`
	ExpiresAt string `json:"expiresAt"`
	RefreshToken string `json:"refreshToken"`
	SessionId string `json:"sessionId"`
	User IamUserResponse `json:"user"`
}

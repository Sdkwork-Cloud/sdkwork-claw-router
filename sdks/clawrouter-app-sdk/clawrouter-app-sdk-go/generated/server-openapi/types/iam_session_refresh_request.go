package types

// Iam session refresh request schema exposed by Claw Router.
type IamSessionRefreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

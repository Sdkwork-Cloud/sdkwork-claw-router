package types

// Iam password reset create request schema exposed by Claw Router.
type IamPasswordResetCreateRequest struct {
	Account string `json:"account"`
	Code string `json:"code"`
	ConfirmPassword string `json:"confirmPassword"`
	NewPassword string `json:"newPassword"`
}

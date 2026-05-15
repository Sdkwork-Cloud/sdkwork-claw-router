package types

// Password reset requests create result schema exposed by Claw Router.
type PasswordResetRequestsCreateResult struct {
	Code string `json:"code"`
	Data IamPasswordResetRequestResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}

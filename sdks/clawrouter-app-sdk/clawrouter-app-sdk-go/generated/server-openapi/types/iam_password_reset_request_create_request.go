package types

// Iam password reset request create request schema exposed by Claw Router.
type IamPasswordResetRequestCreateRequest struct {
	Account string `json:"account"`
	Channel string `json:"channel"`
}

package types

// Iam login qr code status response schema exposed by Claw Router.
type IamLoginQrCodeStatusResponse struct {
	Session IamSessionResponse `json:"session"`
	Status string `json:"status"`
	Token IamSessionResponse `json:"token"`
	UserInfo IamUserResponse `json:"userInfo"`
}

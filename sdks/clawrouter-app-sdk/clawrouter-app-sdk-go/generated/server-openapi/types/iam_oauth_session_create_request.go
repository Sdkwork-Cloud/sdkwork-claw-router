package types

// Iam oauth session create request schema exposed by Claw Router.
type IamOauthSessionCreateRequest struct {
	Code string `json:"code"`
	DeviceId string `json:"deviceId"`
	DeviceType string `json:"deviceType"`
	Provider string `json:"provider"`
	State string `json:"state"`
}

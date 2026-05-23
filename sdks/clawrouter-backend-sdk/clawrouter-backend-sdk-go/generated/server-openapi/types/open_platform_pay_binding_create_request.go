package types

// Open platform pay binding create request schema exposed by Claw Router.
type OpenPlatformPayBindingCreateRequest struct {
	Mode string `json:"mode"`
	PaymentAccountId string `json:"paymentAccountId"`
	PaymentChannelId string `json:"paymentChannelId"`
	Scene string `json:"scene"`
}

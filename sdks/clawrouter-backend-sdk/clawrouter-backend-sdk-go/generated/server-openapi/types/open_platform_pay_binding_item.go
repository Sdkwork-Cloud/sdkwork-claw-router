package types

// Open platform pay binding item schema exposed by Claw Router.
type OpenPlatformPayBindingItem struct {
	AccountId string `json:"accountId"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	Mode string `json:"mode"`
	PaymentAccountId string `json:"paymentAccountId"`
	PaymentChannelId string `json:"paymentChannelId"`
	Scene string `json:"scene"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
}

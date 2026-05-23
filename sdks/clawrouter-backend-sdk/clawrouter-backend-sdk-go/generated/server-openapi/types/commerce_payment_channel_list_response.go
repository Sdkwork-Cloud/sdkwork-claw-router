package types

// Commerce payment channel list response schema exposed by Claw Router.
type CommercePaymentChannelListResponse struct {
	Items []CommercePaymentChannelItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}

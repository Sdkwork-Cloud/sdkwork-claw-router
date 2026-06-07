package types

// Commerce payment channel list response schema exposed by Claw Router.
type CommercePaymentChannelListResponse struct {
	Items []CommercePaymentChannelItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}

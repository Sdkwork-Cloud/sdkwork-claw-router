package types

// Payments channels list result schema exposed by Claw Router.
type PaymentsChannelsListResult struct {
	Code string `json:"code"`
	Data CommercePaymentChannelListResponse `json:"data"`
	Msg string `json:"msg"`
}

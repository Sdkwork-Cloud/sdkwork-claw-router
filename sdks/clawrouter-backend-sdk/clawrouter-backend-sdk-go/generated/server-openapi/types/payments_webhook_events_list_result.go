package types

// Payments webhook events list result schema exposed by Claw Router.
type PaymentsWebhookEventsListResult struct {
	Code string `json:"code"`
	Data CommercePaymentWebhookEventListResponse `json:"data"`
	Msg string `json:"msg"`
}

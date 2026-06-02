package types

// Commerce payment attempt record schema exposed by Claw Router.
type CommercePaymentAttemptRecord struct {
	Amount string `json:"amount"`
	CallbackPayload string `json:"callback_payload"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	Id string `json:"id"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	OutTradeNo string `json:"out_trade_no"`
	OwnerUserId string `json:"owner_user_id"`
	PaidAt string `json:"paid_at"`
	PaymentIntentId string `json:"payment_intent_id"`
	Provider string `json:"provider"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}

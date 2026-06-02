package types

// Commerce payment intent record schema exposed by Claw Router.
type CommercePaymentIntentRecord struct {
	Amount string `json:"amount"`
	CapturedAmount string `json:"captured_amount"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	MerchantOrderNo string `json:"merchant_order_no"`
	MetadataJson string `json:"metadata_json"`
	NextActionJson string `json:"next_action_json"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PaymentMethod string `json:"payment_method"`
	Provider string `json:"provider"`
	ProviderCode string `json:"provider_code"`
	ProviderNativeJson string `json:"provider_native_json"`
	RefundedAmount string `json:"refunded_amount"`
	RequestNo string `json:"request_no"`
	SceneCode string `json:"scene_code"`
	Status string `json:"status"`
	Subject string `json:"subject"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}

package types

// Promotion code record schema exposed by Claw Router.
type PromotionCodeRecord struct {
	ActivatedAt string `json:"activated_at"`
	ActivationStatus string `json:"activation_status"`
	CanResend bool `json:"can_resend"`
	CancelUntil string `json:"cancel_until"`
	CanceledAt string `json:"canceled_at"`
	ChannelCode string `json:"channel_code"`
	ClaimCodeHash string `json:"claim_code_hash"`
	ClaimCodeSuffix string `json:"claim_code_suffix"`
	CodeNo string `json:"code_no"`
	CodeType string `json:"code_type"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	CurrencyCode string `json:"currency_code"`
	ExpiresAt string `json:"expires_at"`
	OfferId string `json:"offer_id"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	PromotionCodeHash string `json:"promotion_code_hash"`
	PromotionCodeLast4 string `json:"promotion_code_last4"`
	StartsAt string `json:"starts_at"`
	Status string `json:"status"`
	StockId string `json:"stock_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UpdatedBy string `json:"updated_by"`
}

package types

// Promotion code redemption record schema exposed by Claw Router.
type PromotionCodeRedemptionRecord struct {
	CodeId string `json:"code_id"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	FailureCode string `json:"failure_code"`
	FailureMessage string `json:"failure_message"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	OccurredAt string `json:"occurred_at"`
	OfferId string `json:"offer_id"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	RedemptionChannel string `json:"redemption_channel"`
	RedemptionNo string `json:"redemption_no"`
	RedemptionScene string `json:"redemption_scene"`
	RequestNo string `json:"request_no"`
	ResultStatus string `json:"result_status"`
	StockId string `json:"stock_id"`
	SubjectId string `json:"subject_id"`
	SubjectType string `json:"subject_type"`
	SubmittedCodeHash string `json:"submitted_code_hash"`
	SubmittedCodeSuffix string `json:"submitted_code_suffix"`
	TenantId string `json:"tenant_id"`
	UserCouponId string `json:"user_coupon_id"`
}

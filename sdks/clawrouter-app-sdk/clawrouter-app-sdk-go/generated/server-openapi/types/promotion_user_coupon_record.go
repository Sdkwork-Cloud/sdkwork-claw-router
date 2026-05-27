package types

// Promotion user coupon record schema exposed by Claw Router.
type PromotionUserCouponRecord struct {
	ActivationStatus string `json:"activation_status"`
	BudgetAccountId string `json:"budget_account_id"`
	CanResend bool `json:"can_resend"`
	CancelUntil string `json:"cancel_until"`
	ClaimCodeHash string `json:"claim_code_hash"`
	ClaimCodeSuffix string `json:"claim_code_suffix"`
	ClaimSource string `json:"claim_source"`
	ClaimedAt string `json:"claimed_at"`
	CodeId string `json:"code_id"`
	CouponCodeHash string `json:"coupon_code_hash"`
	CouponCodeSuffix string `json:"coupon_code_suffix"`
	CouponNo string `json:"coupon_no"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	DisabledAt string `json:"disabled_at"`
	DiscountPercentBps int `json:"discount_percent_bps"`
	ExpiresAt string `json:"expires_at"`
	IdempotencyKey string `json:"idempotency_key"`
	LockExpiresAt string `json:"lock_expires_at"`
	LockedAt string `json:"locked_at"`
	OfferId string `json:"offer_id"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	RecognitionHash string `json:"recognition_hash"`
	RecognitionType string `json:"recognition_type"`
	RedeemedAt string `json:"redeemed_at"`
	RequestNo string `json:"request_no"`
	ReturnedAt string `json:"returned_at"`
	Status string `json:"status"`
	StockId string `json:"stock_id"`
	SubjectId string `json:"subject_id"`
	SubjectType string `json:"subject_type"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	ValidFrom string `json:"valid_from"`
	VerifyMethod string `json:"verify_method"`
}

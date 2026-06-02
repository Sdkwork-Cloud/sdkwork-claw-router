package types

// Promotion coupon stock record schema exposed by Claw Router.
type PromotionCouponStockRecord struct {
	ActivationStatus string `json:"activation_status"`
	AvailableQuantity string `json:"available_quantity"`
	BudgetAccountId string `json:"budget_account_id"`
	BudgetStopThresholdBps int `json:"budget_stop_threshold_bps"`
	BudgetWarningThresholdBps int `json:"budget_warning_threshold_bps"`
	CanResend bool `json:"can_resend"`
	CancelUntil string `json:"cancel_until"`
	ClaimedQuantity string `json:"claimed_quantity"`
	CodeMode string `json:"code_mode"`
	CodePrefix string `json:"code_prefix"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	CurrencyCode string `json:"currency_code"`
	DisabledQuantity string `json:"disabled_quantity"`
	ExpiresAt string `json:"expires_at"`
	GeneratedQuantity string `json:"generated_quantity"`
	Id string `json:"id"`
	IssueChannel string `json:"issue_channel"`
	LockedQuantity string `json:"locked_quantity"`
	MaxClaimsPerNaturalPerson int `json:"max_claims_per_natural_person"`
	MaxClaimsPerSubject int `json:"max_claims_per_subject"`
	Name string `json:"name"`
	OfferId string `json:"offer_id"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	OverspendPolicy string `json:"overspend_policy"`
	PerSubjectLimit string `json:"per_subject_limit"`
	RedeemedQuantity string `json:"redeemed_quantity"`
	RequestedQuantity string `json:"requested_quantity"`
	ReturnedQuantity string `json:"returned_quantity"`
	StartsAt string `json:"starts_at"`
	Status string `json:"status"`
	StockCreatorMerchantId string `json:"stock_creator_merchant_id"`
	StockNo string `json:"stock_no"`
	StockType string `json:"stock_type"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	TotalQuantity string `json:"total_quantity"`
	UpdatedAt string `json:"updated_at"`
	UpdatedBy string `json:"updated_by"`
}

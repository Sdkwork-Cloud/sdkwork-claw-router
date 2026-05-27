package types

// Promotion discount application record schema exposed by Claw Router.
type PromotionDiscountApplicationRecord struct {
	ApplicationNo string `json:"application_no"`
	AppliedAt string `json:"applied_at"`
	BudgetAccountId string `json:"budget_account_id"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	FailureCode string `json:"failure_code"`
	FailureMessage string `json:"failure_message"`
	IdempotencyKey string `json:"idempotency_key"`
	OfferId string `json:"offer_id"`
	OfferVersionId string `json:"offer_version_id"`
	OrderId string `json:"order_id"`
	OrderNo string `json:"order_no"`
	OrganizationId string `json:"organization_id"`
	PaymentId string `json:"payment_id"`
	ReleasedAt string `json:"released_at"`
	RequestNo string `json:"request_no"`
	ReservationExpiresAt string `json:"reservation_expires_at"`
	ReservedAt string `json:"reserved_at"`
	RolledBackAt string `json:"rolled_back_at"`
	RuleSnapshotJson map[string]JsonValue `json:"rule_snapshot_json"`
	SettledAt string `json:"settled_at"`
	Status string `json:"status"`
	StockId string `json:"stock_id"`
	SubjectId string `json:"subject_id"`
	SubjectType string `json:"subject_type"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserCouponId string `json:"user_coupon_id"`
}

package types

// Promotion coupon ledger entry record schema exposed by Claw Router.
type PromotionCouponLedgerEntryRecord struct {
	ApplicationId string `json:"application_id"`
	BalanceAfter string `json:"balance_after"`
	BusinessType string `json:"business_type"`
	CreatedAt string `json:"created_at"`
	Direction string `json:"direction"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	LedgerNo string `json:"ledger_no"`
	OccurredAt string `json:"occurred_at"`
	OfferId string `json:"offer_id"`
	OrganizationId string `json:"organization_id"`
	QuantityDelta string `json:"quantity_delta"`
	RequestNo string `json:"request_no"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	StockId string `json:"stock_id"`
	SubjectId string `json:"subject_id"`
	SubjectType string `json:"subject_type"`
	TenantId string `json:"tenant_id"`
	UserCouponId string `json:"user_coupon_id"`
}

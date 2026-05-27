package types

// Ai usage service provider edge record schema exposed by Claw Router.
type AiUsageServiceProviderEdgeRecord struct {
	AmountRole string `json:"amount_role"`
	BillableQuantity string `json:"billable_quantity"`
	BillingMeterCode string `json:"billing_meter_code"`
	BuyerProviderId string `json:"buyer_provider_id"`
	BuyerSnapshot map[string]JsonValue `json:"buyer_snapshot"`
	ChainId string `json:"chain_id"`
	ChargeAmount string `json:"charge_amount"`
	ConvertedChargeAmount string `json:"converted_charge_amount"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	EdgeDepth int `json:"edge_depth"`
	EdgeId string `json:"edge_id"`
	FxRateSnapshot string `json:"fx_rate_snapshot"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PriceSnapshot map[string]JsonValue `json:"price_snapshot"`
	PricingPlanId string `json:"pricing_plan_id"`
	PricingRuleId string `json:"pricing_rule_id"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	SellerProviderId string `json:"seller_provider_id"`
	SellerSnapshot map[string]JsonValue `json:"seller_snapshot"`
	SettlementCurrency string `json:"settlement_currency"`
	SettlementStatus string `json:"settlement_status"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TokenKind string `json:"token_kind"`
	TraceId string `json:"trace_id"`
	UnitPrice string `json:"unit_price"`
	UnitSize string `json:"unit_size"`
	UsageFactId string `json:"usage_fact_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}

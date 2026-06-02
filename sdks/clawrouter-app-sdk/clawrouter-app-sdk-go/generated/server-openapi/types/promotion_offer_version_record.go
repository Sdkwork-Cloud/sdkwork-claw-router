package types

// Promotion offer version record schema exposed by Claw Router.
type PromotionOfferVersionRecord struct {
	BenefitDefinitionId string `json:"benefit_definition_id"`
	BenefitKind string `json:"benefit_kind"`
	BenefitQuantity string `json:"benefit_quantity"`
	BreakagePolicy string `json:"breakage_policy"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	CurrencyCode string `json:"currency_code"`
	CustomerVisible bool `json:"customer_visible"`
	DiscountAmountMinor string `json:"discount_amount_minor"`
	DiscountPercentBps int `json:"discount_percent_bps"`
	DiscountType string `json:"discount_type"`
	FaceValueMinor string `json:"face_value_minor"`
	FixedPriceMinor string `json:"fixed_price_minor"`
	Id string `json:"id"`
	LiabilityPolicy string `json:"liability_policy"`
	LifecycleStatus string `json:"lifecycle_status"`
	MaximumDiscountAmountMinor string `json:"maximum_discount_amount_minor"`
	MinimumOrderAmountMinor string `json:"minimum_order_amount_minor"`
	OfferId string `json:"offer_id"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	ReturnPolicy string `json:"return_policy"`
	RuleSnapshotJson map[string]JsonValue `json:"rule_snapshot_json"`
	SettlementPolicy string `json:"settlement_policy"`
	StackStrategy string `json:"stack_strategy"`
	TaxTreatment string `json:"tax_treatment"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UpdatedBy string `json:"updated_by"`
	ValidityDurationSeconds string `json:"validity_duration_seconds"`
	ValidityType string `json:"validity_type"`
	VersionNo string `json:"version_no"`
}

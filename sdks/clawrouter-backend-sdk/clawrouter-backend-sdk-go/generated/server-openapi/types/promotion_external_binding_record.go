package types

// Promotion external binding record schema exposed by Claw Router.
type PromotionExternalBindingRecord struct {
	BindingNo string `json:"binding_no"`
	ClaimCodeHash string `json:"claim_code_hash"`
	ClaimCodeSuffix string `json:"claim_code_suffix"`
	CodeId string `json:"code_id"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	ExternalCurrencyCode string `json:"external_currency_code"`
	ExternalMerchantId string `json:"external_merchant_id"`
	ExternalObjectId string `json:"external_object_id"`
	ExternalObjectType string `json:"external_object_type"`
	LastErrorCode string `json:"last_error_code"`
	LastErrorMessage string `json:"last_error_message"`
	LastSyncAt string `json:"last_sync_at"`
	MetadataJson map[string]JsonValue `json:"metadata_json"`
	OfferId string `json:"offer_id"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	Platform string `json:"platform"`
	PlatformCardId string `json:"platform_card_id"`
	PlatformCouponId string `json:"platform_coupon_id"`
	PlatformStockId string `json:"platform_stock_id"`
	PlatformTemplateId string `json:"platform_template_id"`
	StockId string `json:"stock_id"`
	SyncStatus string `json:"sync_status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UpdatedBy string `json:"updated_by"`
	UserCouponId string `json:"user_coupon_id"`
}

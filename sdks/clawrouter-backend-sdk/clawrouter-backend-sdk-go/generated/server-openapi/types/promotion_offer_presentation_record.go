package types

// Promotion offer presentation record schema exposed by Claw Router.
type PromotionOfferPresentationRecord struct {
	BrandName string `json:"brand_name"`
	CoverAssetId string `json:"cover_asset_id"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	CustomerActionJson map[string]JsonValue `json:"customer_action_json"`
	DisplayName string `json:"display_name"`
	FieldSchemaJson map[string]JsonValue `json:"field_schema_json"`
	Id string `json:"id"`
	Locale string `json:"locale"`
	LogoAssetId string `json:"logo_asset_id"`
	MerchantDisplayName string `json:"merchant_display_name"`
	OfferId string `json:"offer_id"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	ParamSchemaJson map[string]JsonValue `json:"param_schema_json"`
	PresentationNo string `json:"presentation_no"`
	PrimaryColor string `json:"primary_color"`
	RecognitionHash string `json:"recognition_hash"`
	RecognitionType string `json:"recognition_type"`
	SecondaryColor string `json:"secondary_color"`
	Status string `json:"status"`
	StyleSnapshotJson map[string]JsonValue `json:"style_snapshot_json"`
	SurfaceType string `json:"surface_type"`
	TenantId string `json:"tenant_id"`
	TermsJson map[string]JsonValue `json:"terms_json"`
	UpdatedAt string `json:"updated_at"`
	UpdatedBy string `json:"updated_by"`
	VerifyMethod string `json:"verify_method"`
}

package types

// Commerce billing history record schema exposed by Claw Router.
type CommerceBillingHistoryRecord struct {
	AssetType string `json:"asset_type"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	Direction string `json:"direction"`
	HistoryNo string `json:"history_no"`
	HistoryType string `json:"history_type"`
	MetadataJson map[string]JsonValue `json:"metadata_json"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PaymentMethod string `json:"payment_method"`
	ReferenceNo string `json:"reference_no"`
	RelatedOrderId string `json:"related_order_id"`
	RelatedOrderNo string `json:"related_order_no"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
}

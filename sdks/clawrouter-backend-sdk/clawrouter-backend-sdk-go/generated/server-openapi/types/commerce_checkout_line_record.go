package types

// Commerce checkout line record schema exposed by Claw Router.
type CommerceCheckoutLineRecord struct {
	CheckoutSessionId string `json:"checkout_session_id"`
	CreatedAt string `json:"created_at"`
	FulfillmentType string `json:"fulfillment_type"`
	InventoryReservationId string `json:"inventory_reservation_id"`
	OrganizationId string `json:"organization_id"`
	PriceSnapshotJson map[string]JsonValue `json:"price_snapshot_json"`
	PromotionSnapshotJson map[string]JsonValue `json:"promotion_snapshot_json"`
	PurchaseType string `json:"purchase_type"`
	SkuId string `json:"sku_id"`
	TenantId string `json:"tenant_id"`
}

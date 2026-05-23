package types

// Commerce inventory reservation record schema exposed by Claw Router.
type CommerceInventoryReservationRecord struct {
	CheckoutSessionId string `json:"checkout_session_id"`
	CreatedAt string `json:"created_at"`
	ExpiresAt string `json:"expires_at"`
	IdempotencyKey string `json:"idempotency_key"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	ReservationNo string `json:"reservation_no"`
	SkuId string `json:"sku_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	WarehouseId string `json:"warehouse_id"`
}

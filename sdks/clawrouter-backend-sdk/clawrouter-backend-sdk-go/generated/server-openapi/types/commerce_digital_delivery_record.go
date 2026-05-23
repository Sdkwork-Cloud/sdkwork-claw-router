package types

// Commerce digital delivery record schema exposed by Claw Router.
type CommerceDigitalDeliveryRecord struct {
	CreatedAt string `json:"created_at"`
	DeliveredAt string `json:"delivered_at"`
	DeliveryNo string `json:"delivery_no"`
	DeliveryRef string `json:"delivery_ref"`
	DeliveryType string `json:"delivery_type"`
	FulfillmentId string `json:"fulfillment_id"`
	OrderItemId string `json:"order_item_id"`
	OrganizationId string `json:"organization_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}

package types

// Commerce shipment record schema exposed by Claw Router.
type CommerceShipmentRecord struct {
	CarrierCode string `json:"carrier_code"`
	CreatedAt string `json:"created_at"`
	DeliveredAt string `json:"delivered_at"`
	FulfillmentId string `json:"fulfillment_id"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	ShipmentNo string `json:"shipment_no"`
	ShippedAt string `json:"shipped_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TrackingNo string `json:"tracking_no"`
	UpdatedAt string `json:"updated_at"`
}

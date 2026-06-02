package types

// Commerce shipment tracking event record schema exposed by Claw Router.
type CommerceShipmentTrackingEventRecord struct {
	CreatedAt string `json:"created_at"`
	Description string `json:"description"`
	EventCode string `json:"event_code"`
	EventTime string `json:"event_time"`
	Id string `json:"id"`
	Location string `json:"location"`
	OrganizationId string `json:"organization_id"`
	RawPayloadJson map[string]JsonValue `json:"raw_payload_json"`
	ShipmentId string `json:"shipment_id"`
	TenantId string `json:"tenant_id"`
}

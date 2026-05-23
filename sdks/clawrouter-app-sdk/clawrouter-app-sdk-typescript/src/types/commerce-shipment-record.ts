/** Commerce shipment record schema exposed by Claw Router. */
export interface CommerceShipmentRecord {
  /** Carrier code field on commerce shipment record. */
  carrier_code: string;
  /** Created at field on commerce shipment record. */
  created_at: string;
  /** Delivered at field on commerce shipment record. */
  delivered_at?: string;
  /** Fulfillment id field on commerce shipment record. */
  fulfillment_id: string;
  /** Organization id field on commerce shipment record. */
  organization_id?: string;
  /** Shipment no field on commerce shipment record. */
  shipment_no: string;
  /** Shipped at field on commerce shipment record. */
  shipped_at?: string;
  /** Status field on commerce shipment record. */
  status: string;
  /** Tenant id field on commerce shipment record. */
  tenant_id: string;
  /** Tracking no field on commerce shipment record. */
  tracking_no: string;
  /** Updated at field on commerce shipment record. */
  updated_at: string;
}

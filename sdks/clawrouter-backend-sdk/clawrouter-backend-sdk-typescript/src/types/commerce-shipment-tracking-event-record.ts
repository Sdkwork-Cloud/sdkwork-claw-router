import type { JsonValue } from './json-value';

/** Commerce shipment tracking event record schema exposed by Claw Router. */
export interface CommerceShipmentTrackingEventRecord {
  /** Created at field on commerce shipment tracking event record. */
  created_at: string;
  /** Description field on commerce shipment tracking event record. */
  description?: string;
  /** Event code field on commerce shipment tracking event record. */
  event_code: string;
  /** Event time field on commerce shipment tracking event record. */
  event_time: string;
  /** Id field on commerce shipment tracking event record. */
  id?: string;
  /** Location field on commerce shipment tracking event record. */
  location?: string;
  /** Organization id field on commerce shipment tracking event record. */
  organization_id?: string;
  /** Raw payload json field on commerce shipment tracking event record. */
  raw_payload_json?: Record<string, JsonValue>;
  /** Shipment id field on commerce shipment tracking event record. */
  shipment_id: string;
  /** Tenant id field on commerce shipment tracking event record. */
  tenant_id: string;
}

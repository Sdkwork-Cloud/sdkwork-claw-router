/** Promotion offer time window record schema exposed by Claw Router. */
export interface PromotionOfferTimeWindowRecord {
  /** Created at field on promotion offer time window record. */
  created_at: string;
  /** Ends at field on promotion offer time window record. */
  ends_at?: string;
  /** Local end time field on promotion offer time window record. */
  local_end_time?: string;
  /** Local start time field on promotion offer time window record. */
  local_start_time?: string;
  /** Offer version id field on promotion offer time window record. */
  offer_version_id: string;
  /** Organization id field on promotion offer time window record. */
  organization_id?: string;
  /** Starts at field on promotion offer time window record. */
  starts_at?: string;
  /** Tenant id field on promotion offer time window record. */
  tenant_id: string;
  /** Timezone field on promotion offer time window record. */
  timezone?: string;
  /** Updated at field on promotion offer time window record. */
  updated_at: string;
  /** Weekday mask field on promotion offer time window record. */
  weekday_mask?: number;
  /** Window type field on promotion offer time window record. */
  window_type: string;
}

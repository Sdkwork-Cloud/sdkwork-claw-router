import type { JsonValue } from './json-value';

/** Commerce service provider exposure snapshot record schema exposed by Claw Router. */
export interface CommerceServiceProviderExposureSnapshotRecord {
  /** Balance amount field on commerce service provider exposure snapshot record. */
  balance_amount?: string;
  /** Calculated at field on commerce service provider exposure snapshot record. */
  calculated_at?: string;
  /** Created at field on commerce service provider exposure snapshot record. */
  created_at?: string;
  /** Credit limit amount field on commerce service provider exposure snapshot record. */
  credit_limit_amount?: string;
  /** Currency field on commerce service provider exposure snapshot record. */
  currency?: string;
  /** Exposure amount field on commerce service provider exposure snapshot record. */
  exposure_amount?: string;
  /** Frozen amount field on commerce service provider exposure snapshot record. */
  frozen_amount?: string;
  /** Id field on commerce service provider exposure snapshot record. */
  id?: string;
  /** Metadata field on commerce service provider exposure snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on commerce service provider exposure snapshot record. */
  organization_id?: string;
  /** Overdue amount field on commerce service provider exposure snapshot record. */
  overdue_amount?: string;
  /** Pending settlement amount field on commerce service provider exposure snapshot record. */
  pending_settlement_amount?: string;
  /** Rebuild version field on commerce service provider exposure snapshot record. */
  rebuild_version?: string;
  /** Risk status field on commerce service provider exposure snapshot record. */
  risk_status?: string;
  /** Service provider id field on commerce service provider exposure snapshot record. */
  service_provider_id?: string;
  /** Source id field on commerce service provider exposure snapshot record. */
  source_id?: string;
  /** Source type field on commerce service provider exposure snapshot record. */
  source_type?: string;
  /** Source version field on commerce service provider exposure snapshot record. */
  source_version?: string;
  /** Status field on commerce service provider exposure snapshot record. */
  status?: string;
  /** Tenant id field on commerce service provider exposure snapshot record. */
  tenant_id?: string;
  /** Updated at field on commerce service provider exposure snapshot record. */
  updated_at?: string;
  /** Used credit amount field on commerce service provider exposure snapshot record. */
  used_credit_amount?: string;
  /** Uuid field on commerce service provider exposure snapshot record. */
  uuid?: string;
}

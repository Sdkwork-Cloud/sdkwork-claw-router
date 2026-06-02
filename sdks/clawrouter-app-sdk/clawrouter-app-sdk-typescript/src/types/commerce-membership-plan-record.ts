import type { JsonValue } from './json-value';

/** Commerce membership plan record schema exposed by Claw Router. */
export interface CommerceMembershipPlanRecord {
  /** Benefits json field on commerce membership plan record. */
  benefits_json?: Record<string, JsonValue>;
  /** Created at field on commerce membership plan record. */
  created_at: string;
  /** Id field on commerce membership plan record. */
  id?: string;
  /** Level code field on commerce membership plan record. */
  level_code: string;
  /** Name field on commerce membership plan record. */
  name: string;
  /** Organization id field on commerce membership plan record. */
  organization_id?: string;
  /** Plan no field on commerce membership plan record. */
  plan_no: string;
  /** Sort order field on commerce membership plan record. */
  sort_order: string;
  /** Status field on commerce membership plan record. */
  status: string;
  /** Tenant id field on commerce membership plan record. */
  tenant_id: string;
  /** Updated at field on commerce membership plan record. */
  updated_at: string;
}

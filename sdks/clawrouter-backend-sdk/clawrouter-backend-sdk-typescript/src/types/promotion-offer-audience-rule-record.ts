import type { JsonValue } from './json-value';

/** Promotion offer audience rule record schema exposed by Claw Router. */
export interface PromotionOfferAudienceRuleRecord {
  /** Created at field on promotion offer audience rule record. */
  created_at: string;
  /** Id field on promotion offer audience rule record. */
  id?: string;
  /** Offer version id field on promotion offer audience rule record. */
  offer_version_id: string;
  /** Organization id field on promotion offer audience rule record. */
  organization_id?: string;
  /** Priority field on promotion offer audience rule record. */
  priority: number;
  /** Rule operator field on promotion offer audience rule record. */
  rule_operator: string;
  /** Rule type field on promotion offer audience rule record. */
  rule_type: string;
  /** Rule value field on promotion offer audience rule record. */
  rule_value?: string;
  /** Rule value json field on promotion offer audience rule record. */
  rule_value_json?: Record<string, JsonValue>;
  /** Tenant id field on promotion offer audience rule record. */
  tenant_id: string;
  /** Updated at field on promotion offer audience rule record. */
  updated_at: string;
}

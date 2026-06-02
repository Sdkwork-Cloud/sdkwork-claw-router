/** Commerce category seed initialize summary schema exposed by Claw Router. */
export interface CommerceCategorySeedInitializeSummary {
  /** Config key field on commerce category seed initialize summary. */
  configKey: string;
  /** Dataset field on commerce category seed initialize summary. */
  dataset: string;
  /** Install default enabled field on commerce category seed initialize summary. */
  installDefaultEnabled: boolean;
  /** Requested field on commerce category seed initialize summary. */
  requested: number;
  /** Skipped field on commerce category seed initialize summary. */
  skipped: number;
  /** Target table field on commerce category seed initialize summary. */
  targetTable: 'commerce_product_category' | 'plus_category';
  /** Upserted field on commerce category seed initialize summary. */
  upserted: number;
}

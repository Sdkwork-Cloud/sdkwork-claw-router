/** Admin model mapping rule schema exposed by Claw Router. */
export interface AdminModelMappingRule {
  /** Channel code field on admin model mapping rule. */
  channelCode?: string | null;
  /** Channel id field on admin model mapping rule. */
  channelId?: string | null;
  /** Created at field on admin model mapping rule. */
  createdAt?: string | null;
  /** Description field on admin model mapping rule. */
  description?: string | null;
  /** Effective from field on admin model mapping rule. */
  effectiveFrom?: string | null;
  /** Effective to field on admin model mapping rule. */
  effectiveTo?: string | null;
  /** Enabled field on admin model mapping rule. */
  enabled: boolean;
  /** Id field on admin model mapping rule. */
  id: string;
  /** Mapping mode field on admin model mapping rule. */
  mappingMode: 'alias';
  /** Match type field on admin model mapping rule. */
  matchType: 'exact';
  /** Priority field on admin model mapping rule. */
  priority: number;
  /** Scope type field on admin model mapping rule. */
  scopeType: 'global' | 'vendor' | 'channel';
  /** Source catalog key field on admin model mapping rule. */
  sourceCatalogKey?: string | null;
  /** Source model field on admin model mapping rule. */
  sourceModel: string;
  /** Source vendor code field on admin model mapping rule. */
  sourceVendorCode?: string | null;
  /** Target catalog key field on admin model mapping rule. */
  targetCatalogKey?: string | null;
  /** Target model field on admin model mapping rule. */
  targetModel: string;
  /** Target provider model field on admin model mapping rule. */
  targetProviderModel?: string | null;
  /** Target provider native model field on admin model mapping rule. */
  targetProviderNativeModel?: string | null;
  /** Target vendor code field on admin model mapping rule. */
  targetVendorCode?: string | null;
  /** Updated at field on admin model mapping rule. */
  updatedAt?: string | null;
  /** Vendor code field on admin model mapping rule. */
  vendorCode?: string | null;
  /** Vendor id field on admin model mapping rule. */
  vendorId?: string | null;
}

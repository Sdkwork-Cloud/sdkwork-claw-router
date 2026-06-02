/** Admin model mapping mutation item schema exposed by Claw Router. */
export interface AdminModelMappingMutationItem {
  /** Channel code field on admin model mapping mutation item. */
  channelCode?: string | null;
  /** Created at field on admin model mapping mutation item. */
  createdAt?: string | null;
  /** Description field on admin model mapping mutation item. */
  description?: string | null;
  /** Effective from field on admin model mapping mutation item. */
  effectiveFrom?: string | null;
  /** Effective to field on admin model mapping mutation item. */
  effectiveTo?: string | null;
  /** Enabled field on admin model mapping mutation item. */
  enabled: boolean;
  /** Id field on admin model mapping mutation item. */
  id: string;
  /** Mapping mode field on admin model mapping mutation item. */
  mappingMode: 'alias';
  /** Match type field on admin model mapping mutation item. */
  matchType: 'exact';
  /** Priority field on admin model mapping mutation item. */
  priority: number;
  /** Scope type field on admin model mapping mutation item. */
  scopeType: 'global' | 'vendor' | 'channel';
  /** Source catalog key field on admin model mapping mutation item. */
  sourceCatalogKey?: string | null;
  /** Source model field on admin model mapping mutation item. */
  sourceModel: string;
  /** Source vendor code field on admin model mapping mutation item. */
  sourceVendorCode?: string | null;
  /** Target catalog key field on admin model mapping mutation item. */
  targetCatalogKey?: string | null;
  /** Target model field on admin model mapping mutation item. */
  targetModel: string;
  /** Target provider model field on admin model mapping mutation item. */
  targetProviderModel?: string | null;
  /** Target provider native model field on admin model mapping mutation item. */
  targetProviderNativeModel?: string | null;
  /** Target vendor code field on admin model mapping mutation item. */
  targetVendorCode?: string | null;
  /** Updated at field on admin model mapping mutation item. */
  updatedAt?: string | null;
  /** Vendor code field on admin model mapping mutation item. */
  vendorCode?: string | null;
}

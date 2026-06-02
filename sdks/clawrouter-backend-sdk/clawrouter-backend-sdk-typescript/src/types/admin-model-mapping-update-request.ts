/** Admin model mapping update request schema exposed by Claw Router. */
export interface AdminModelMappingUpdateRequest {
  /** Channel code field on admin model mapping update request. */
  channelCode?: string | null;
  /** Channel id field on admin model mapping update request. */
  channelId?: string | null;
  /** Description field on admin model mapping update request. */
  description?: string | null;
  /** Effective from field on admin model mapping update request. */
  effectiveFrom?: string | null;
  /** Effective to field on admin model mapping update request. */
  effectiveTo?: string | null;
  /** Enabled field on admin model mapping update request. */
  enabled?: boolean;
  /** Mapping mode field on admin model mapping update request. */
  mappingMode?: 'alias';
  /** Match type field on admin model mapping update request. */
  matchType?: 'exact';
  /** Priority field on admin model mapping update request. */
  priority?: number;
  /** Scope type field on admin model mapping update request. */
  scopeType?: 'global' | 'vendor' | 'channel';
  /** Source catalog key field on admin model mapping update request. */
  sourceCatalogKey?: string | null;
  /** Source model field on admin model mapping update request. */
  sourceModel?: string;
  /** Source vendor code field on admin model mapping update request. */
  sourceVendorCode?: string | null;
  /** Target catalog key field on admin model mapping update request. */
  targetCatalogKey?: string | null;
  /** Target model field on admin model mapping update request. */
  targetModel?: string;
  /** Target provider model field on admin model mapping update request. */
  targetProviderModel?: string | null;
  /** Target provider native model field on admin model mapping update request. */
  targetProviderNativeModel?: string | null;
  /** Target vendor code field on admin model mapping update request. */
  targetVendorCode?: string | null;
  /** Vendor code field on admin model mapping update request. */
  vendorCode?: string | null;
  /** Vendor id field on admin model mapping update request. */
  vendorId?: string | null;
}

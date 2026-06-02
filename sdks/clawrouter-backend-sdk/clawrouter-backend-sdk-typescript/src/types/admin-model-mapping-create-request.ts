/** Admin model mapping create request schema exposed by Claw Router. */
export interface AdminModelMappingCreateRequest {
  /** Channel code field on admin model mapping create request. */
  channelCode?: string | null;
  /** Channel id field on admin model mapping create request. */
  channelId?: string | null;
  /** Description field on admin model mapping create request. */
  description?: string | null;
  /** Effective from field on admin model mapping create request. */
  effectiveFrom?: string | null;
  /** Effective to field on admin model mapping create request. */
  effectiveTo?: string | null;
  /** Enabled field on admin model mapping create request. */
  enabled?: boolean;
  /** Mapping mode field on admin model mapping create request. */
  mappingMode?: 'alias';
  /** Match type field on admin model mapping create request. */
  matchType?: 'exact';
  /** Priority field on admin model mapping create request. */
  priority?: number;
  /** Scope type field on admin model mapping create request. */
  scopeType: 'global' | 'vendor' | 'channel';
  /** Source catalog key field on admin model mapping create request. */
  sourceCatalogKey?: string | null;
  /** Source model field on admin model mapping create request. */
  sourceModel: string;
  /** Source vendor code field on admin model mapping create request. */
  sourceVendorCode?: string | null;
  /** Target catalog key field on admin model mapping create request. */
  targetCatalogKey?: string | null;
  /** Target model field on admin model mapping create request. */
  targetModel: string;
  /** Target provider model field on admin model mapping create request. */
  targetProviderModel?: string | null;
  /** Target provider native model field on admin model mapping create request. */
  targetProviderNativeModel?: string | null;
  /** Target vendor code field on admin model mapping create request. */
  targetVendorCode?: string | null;
  /** Vendor code field on admin model mapping create request. */
  vendorCode?: string | null;
  /** Vendor id field on admin model mapping create request. */
  vendorId?: string | null;
}

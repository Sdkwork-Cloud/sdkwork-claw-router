/** Admin cache summary schema exposed by Claw Router. */
export interface AdminCacheSummary {
  /** Cache deletes field on admin cache summary. */
  cacheDeletes: number;
  /** Cache errors field on admin cache summary. */
  cacheErrors: number;
  /** Cache hits field on admin cache summary. */
  cacheHits: number;
  /** Cache inspections field on admin cache summary. */
  cacheInspections: number;
  /** Cache misses field on admin cache summary. */
  cacheMisses: number;
  /** Cache refreshes field on admin cache summary. */
  cacheRefreshes: number;
  /** Cache writes field on admin cache summary. */
  cacheWrites: number;
  /** Expired entries field on admin cache summary. */
  expiredEntries: number;
  /** Runtime target field on admin cache summary. */
  runtimeTarget: 'desktop_packaged' | 'service';
  /** Total entries field on admin cache summary. */
  totalEntries: number;
  /** Total instances field on admin cache summary. */
  totalInstances: number;
  /** Total namespaces field on admin cache summary. */
  totalNamespaces: number;
}

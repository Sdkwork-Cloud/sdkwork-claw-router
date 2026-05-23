/** Admin cache instance schema exposed by Claw Router. */
export interface AdminCacheInstance {
  /** Cache deletes field on admin cache instance. */
  cacheDeletes: number;
  /** Cache errors field on admin cache instance. */
  cacheErrors: number;
  /** Cache hits field on admin cache instance. */
  cacheHits: number;
  /** Cache inspections field on admin cache instance. */
  cacheInspections: number;
  /** Cache misses field on admin cache instance. */
  cacheMisses: number;
  /** Cache refreshes field on admin cache instance. */
  cacheRefreshes: number;
  /** Cache writes field on admin cache instance. */
  cacheWrites: number;
  /** Connection profile name field on admin cache instance. */
  connectionProfileName?: string | null;
  /** Default ttl seconds field on admin cache instance. */
  defaultTtlSeconds: number;
  /** Entry count field on admin cache instance. */
  entryCount: number;
  /** Expired entry count field on admin cache instance. */
  expiredEntryCount: number;
  /** Key prefix field on admin cache instance. */
  keyPrefix: string;
  /** Max entries field on admin cache instance. */
  maxEntries?: number | null;
  /** Name field on admin cache instance. */
  name: string;
  /** Provider kind field on admin cache instance. */
  providerKind: 'local_cache' | 'redis_cache';
  /** Purpose field on admin cache instance. */
  purpose: string;
  /** Status field on admin cache instance. */
  status: string;
  /** Supports delete field on admin cache instance. */
  supportsDelete: boolean;
  /** Supports inspect field on admin cache instance. */
  supportsInspect: boolean;
  /** Supports refresh field on admin cache instance. */
  supportsRefresh: boolean;
}

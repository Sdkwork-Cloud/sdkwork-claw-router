package types

// Admin cache summary schema exposed by Claw Router.
type AdminCacheSummary struct {
	CacheDeletes int `json:"cacheDeletes"`
	CacheErrors int `json:"cacheErrors"`
	CacheHits int `json:"cacheHits"`
	CacheInspections int `json:"cacheInspections"`
	CacheMisses int `json:"cacheMisses"`
	CacheRefreshes int `json:"cacheRefreshes"`
	CacheWrites int `json:"cacheWrites"`
	ExpiredEntries int `json:"expiredEntries"`
	RuntimeTarget string `json:"runtimeTarget"`
	TotalEntries int `json:"totalEntries"`
	TotalInstances int `json:"totalInstances"`
	TotalNamespaces int `json:"totalNamespaces"`
}

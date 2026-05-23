package types

// Admin cache instance schema exposed by Claw Router.
type AdminCacheInstance struct {
	CacheDeletes int `json:"cacheDeletes"`
	CacheErrors int `json:"cacheErrors"`
	CacheHits int `json:"cacheHits"`
	CacheInspections int `json:"cacheInspections"`
	CacheMisses int `json:"cacheMisses"`
	CacheRefreshes int `json:"cacheRefreshes"`
	CacheWrites int `json:"cacheWrites"`
	ConnectionProfileName string `json:"connectionProfileName"`
	DefaultTtlSeconds int `json:"defaultTtlSeconds"`
	EntryCount int `json:"entryCount"`
	ExpiredEntryCount int `json:"expiredEntryCount"`
	KeyPrefix string `json:"keyPrefix"`
	MaxEntries int `json:"maxEntries"`
	Name string `json:"name"`
	ProviderKind string `json:"providerKind"`
	Purpose string `json:"purpose"`
	Status string `json:"status"`
	SupportsDelete bool `json:"supportsDelete"`
	SupportsInspect bool `json:"supportsInspect"`
	SupportsRefresh bool `json:"supportsRefresh"`
}

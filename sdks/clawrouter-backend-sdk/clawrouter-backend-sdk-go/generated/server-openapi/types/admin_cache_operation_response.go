package types

// Admin cache operation response schema exposed by Claw Router.
type AdminCacheOperationResponse struct {
	CacheKey string `json:"cacheKey"`
	DeletedEntries int `json:"deletedEntries"`
	InstanceName string `json:"instanceName"`
	Namespace string `json:"namespace"`
	Operation string `json:"operation"`
	RefreshedEntries int `json:"refreshedEntries"`
	Status string `json:"status"`
}

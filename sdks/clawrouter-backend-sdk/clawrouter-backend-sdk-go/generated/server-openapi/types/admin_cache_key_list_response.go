package types

// Admin cache key list response schema exposed by Claw Router.
type AdminCacheKeyListResponse struct {
	HasMore bool `json:"hasMore"`
	InstanceName string `json:"instanceName"`
	Items []AdminCacheKeyItem `json:"items"`
	Limit int `json:"limit"`
	Namespace string `json:"namespace"`
	NextCursor string `json:"nextCursor"`
	ReturnedItems int `json:"returnedItems"`
	ScanComplete bool `json:"scanComplete"`
	ScannedItems int `json:"scannedItems"`
}

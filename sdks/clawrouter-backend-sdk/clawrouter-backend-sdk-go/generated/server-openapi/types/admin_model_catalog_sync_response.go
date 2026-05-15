package types

// Admin model catalog sync response schema exposed by Claw Router.
type AdminModelCatalogSyncResponse struct {
	AcceptedCount int `json:"acceptedCount"`
	CapabilityCount int `json:"capabilityCount"`
	CatalogRoot string `json:"catalogRoot"`
	CatalogVersion string `json:"catalogVersion"`
	DryRun bool `json:"dryRun"`
	FamilyCount int `json:"familyCount"`
	MeterCount int `json:"meterCount"`
	Mode string `json:"mode"`
	ModelCount int `json:"modelCount"`
	Models []AdminAiModelItem `json:"models"`
	PriceCount int `json:"priceCount"`
	RankingCount int `json:"rankingCount"`
	RequestedCatalogVersion string `json:"requestedCatalogVersion"`
	SnapshotId string `json:"snapshotId"`
	Source string `json:"source"`
	SourceHash string `json:"sourceHash"`
	SyncRunId string `json:"syncRunId"`
	Synced bool `json:"synced"`
	VendorCodes []string `json:"vendorCodes"`
	VendorCount int `json:"vendorCount"`
	Vendors []AdminModelVendorItem `json:"vendors"`
}

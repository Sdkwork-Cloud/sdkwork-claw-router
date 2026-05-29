package types

// Admin ai resource item schema exposed by Claw Router.
type AdminAiResourceItem struct {
	ApiEndpointCode string `json:"apiEndpointCode"`
	CatalogKey string `json:"catalogKey"`
	CompositionMode string `json:"compositionMode"`
	DisplayName string `json:"displayName"`
	Id string `json:"id"`
	Members []AdminAiResourceMemberItem `json:"members"`
	ModalityCode string `json:"modalityCode"`
	Model string `json:"model"`
	ProviderNativeModel string `json:"providerNativeModel"`
	ResourceCode string `json:"resourceCode"`
	ResourceType string `json:"resourceType"`
	SortOrder int `json:"sortOrder"`
	Status string `json:"status"`
	VendorCode string `json:"vendorCode"`
}

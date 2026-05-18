package types

// Updated API key metadata. Authenticated owner management responses include copyableKey for console copy actions.
type AppApiKeyItem struct {
	CopyableKey string `json:"copyableKey"`
	Created string `json:"created"`
	Expires string `json:"expires"`
	Group string `json:"group"`
	Id string `json:"id"`
	IpLimit string `json:"ipLimit"`
	MaskedKey string `json:"maskedKey"`
	Modalities []string `json:"modalities"`
	Name string `json:"name"`
	Quota string `json:"quota"`
	Rate string `json:"rate"`
	Status string `json:"status"`
	UsedQuota string `json:"usedQuota"`
}

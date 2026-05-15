package types

// Created API key metadata with masked key material.
type AppApiKeyItem struct {
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

package types

// Create api key request schema exposed by Claw Router.
type CreateApiKeyRequest struct {
	Expires string `json:"expires"`
	Group string `json:"group"`
	IpLimit string `json:"ipLimit"`
	IsUnlimitedQuota bool `json:"isUnlimitedQuota"`
	Modalities []string `json:"modalities"`
	Name string `json:"name"`
	Quota string `json:"quota"`
}

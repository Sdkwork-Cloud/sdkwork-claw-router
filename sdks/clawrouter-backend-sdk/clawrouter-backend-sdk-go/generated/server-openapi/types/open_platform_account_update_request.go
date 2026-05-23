package types

// Open platform account update request schema exposed by Claw Router.
type OpenPlatformAccountUpdateRequest struct {
	AesKeyRef string `json:"aesKeyRef"`
	AppId string `json:"appId"`
	DefaultEntryId string `json:"defaultEntryId"`
	Name string `json:"name"`
	QrDefault bool `json:"qrDefault"`
	SecretRef string `json:"secretRef"`
	Status string `json:"status"`
	TokenRef string `json:"tokenRef"`
}

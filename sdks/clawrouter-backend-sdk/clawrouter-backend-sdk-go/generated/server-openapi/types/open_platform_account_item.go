package types

// Open platform account item schema exposed by Claw Router.
type OpenPlatformAccountItem struct {
	AesKeyRef string `json:"aesKeyRef"`
	AppId string `json:"appId"`
	CreatedAt string `json:"createdAt"`
	DefaultEntryId string `json:"defaultEntryId"`
	Id string `json:"id"`
	Key string `json:"key"`
	Name string `json:"name"`
	Provider string `json:"provider"`
	QrDefault bool `json:"qrDefault"`
	SecretRef string `json:"secretRef"`
	Status string `json:"status"`
	TokenRef string `json:"tokenRef"`
	Type string `json:"type"`
	UpdatedAt string `json:"updatedAt"`
}

package types

// Open platform account create request schema exposed by Claw Router.
type OpenPlatformAccountCreateRequest struct {
	AesKeyRef string `json:"aesKeyRef"`
	AppId string `json:"appId"`
	Key string `json:"key"`
	Name string `json:"name"`
	Provider string `json:"provider"`
	SecretRef string `json:"secretRef"`
	TokenRef string `json:"tokenRef"`
	Type string `json:"type"`
}

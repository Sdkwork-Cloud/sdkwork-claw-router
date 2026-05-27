package types

// Open platform account update request schema exposed by Claw Router.
type OpenPlatformAccountUpdateRequest struct {
	AppId string `json:"appId"`
	AppSecret string `json:"appSecret"`
	DefaultEntryId string `json:"defaultEntryId"`
	EncodingAesKey string `json:"encodingAesKey"`
	Name string `json:"name"`
	QrDefault bool `json:"qrDefault"`
	Status string `json:"status"`
	Token string `json:"token"`
}

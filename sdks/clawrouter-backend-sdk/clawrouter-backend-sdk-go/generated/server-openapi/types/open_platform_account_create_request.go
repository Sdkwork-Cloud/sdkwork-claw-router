package types

// Open platform account create request schema exposed by Claw Router.
type OpenPlatformAccountCreateRequest struct {
	AppId string `json:"appId"`
	AppSecret string `json:"appSecret"`
	EncodingAesKey string `json:"encodingAesKey"`
	Key string `json:"key"`
	Name string `json:"name"`
	Provider string `json:"provider"`
	Token string `json:"token"`
	Type string `json:"type"`
}

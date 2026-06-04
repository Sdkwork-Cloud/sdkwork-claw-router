package types

// Admin channel credential item schema exposed by Claw Router.
type AdminChannelCredentialItem struct {
	ApiKey string `json:"apiKey"`
	BaseUrl string `json:"baseUrl"`
	CredentialId string `json:"credentialId"`
	Errors int `json:"errors"`
	Id string `json:"id"`
	MaskedLabel string `json:"maskedLabel"`
	Name string `json:"name"`
	Priority int `json:"priority"`
	SecretRef string `json:"secretRef"`
	Status string `json:"status"`
	Weight int `json:"weight"`
}

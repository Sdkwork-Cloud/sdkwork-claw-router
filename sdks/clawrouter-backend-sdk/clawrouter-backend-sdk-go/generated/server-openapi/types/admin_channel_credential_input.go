package types

// Admin channel credential input schema exposed by Claw Router.
type AdminChannelCredentialInput struct {
	ApiKey string `json:"apiKey"`
	BaseUrl string `json:"baseUrl"`
	Name string `json:"name"`
	Priority int `json:"priority"`
	SecretRef string `json:"secretRef"`
	Status string `json:"status"`
	Weight int `json:"weight"`
}

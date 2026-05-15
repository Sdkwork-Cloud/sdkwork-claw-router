package types

// Provider config schema exposed by Claw Router.
type ProviderConfig struct {
	Description string `json:"description"`
	Id string `json:"id"`
	IntegrationType string `json:"integrationType"`
	Name string `json:"name"`
	ProviderFamily string `json:"providerFamily"`
	Status string `json:"status"`
	Url string `json:"url"`
}

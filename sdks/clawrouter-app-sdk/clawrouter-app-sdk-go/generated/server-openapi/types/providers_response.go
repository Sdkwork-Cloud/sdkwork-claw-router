package types

// Providers response schema exposed by Claw Router.
type ProvidersResponse struct {
	Items []ProviderConfig `json:"items"`
}

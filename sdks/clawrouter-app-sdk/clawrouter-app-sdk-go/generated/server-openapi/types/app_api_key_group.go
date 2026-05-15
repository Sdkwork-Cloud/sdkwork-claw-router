package types

// App api key group schema exposed by Claw Router.
type AppApiKeyGroup struct {
	Code string `json:"code"`
	Id string `json:"id"`
	Name string `json:"name"`
	Rate string `json:"rate"`
}

package types

// App api key group list response schema exposed by Claw Router.
type AppApiKeyGroupListResponse struct {
	Items []AppApiKeyGroup `json:"items"`
}

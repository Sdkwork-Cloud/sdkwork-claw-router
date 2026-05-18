package types

// Dashboard overview summary schema exposed by Claw Router.
type DashboardOverviewSummary struct {
	AudioRequests int `json:"audioRequests"`
	AvailableCredits float64 `json:"availableCredits"`
	ErrorCount int `json:"errorCount"`
	ImageRequests int `json:"imageRequests"`
	MusicRequests int `json:"musicRequests"`
	RequestCount int `json:"requestCount"`
	Rpm float64 `json:"rpm"`
	TotalRequestCount int `json:"totalRequestCount"`
	TotalUsedCredits float64 `json:"totalUsedCredits"`
	Tpm float64 `json:"tpm"`
	UsedCredits float64 `json:"usedCredits"`
	VideoRequests int `json:"videoRequests"`
}

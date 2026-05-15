package types

// Admin access group update request schema exposed by Claw Router.
type AdminAccessGroupUpdateRequest struct {
	BillingType string `json:"billingType"`
	Capacity map[string]interface{} `json:"capacity"`
	Name string `json:"name"`
	Platform string `json:"platform"`
	RateMultiplier float64 `json:"rateMultiplier"`
	Status string `json:"status"`
	Type string `json:"type"`
}

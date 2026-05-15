package types

// Persisted access group snapshot returned by the backend.
type AdminAccessGroupItem struct {
	AccountCount AdminCountPair `json:"accountCount"`
	BillingType string `json:"billingType"`
	Capacity AdminCapacityPair `json:"capacity"`
	Id string `json:"id"`
	Name string `json:"name"`
	Platform string `json:"platform"`
	RateMultiplier float64 `json:"rateMultiplier"`
	Status string `json:"status"`
	Type string `json:"type"`
	Usage AdminUsagePair `json:"usage"`
}

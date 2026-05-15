package types

// Persisted rate limit rule snapshot returned by the backend.
type AdminRateLimitItem struct {
	BlockDuration string `json:"blockDuration"`
	Burst int `json:"burst"`
	Group string `json:"group"`
	Id string `json:"id"`
	KeyPrefix string `json:"keyPrefix"`
	Model string `json:"model"`
	Rpd int `json:"rpd"`
	Rpm int `json:"rpm"`
	Rps int `json:"rps"`
	RuleName string `json:"ruleName"`
	Status string `json:"status"`
	TargetIp string `json:"targetIp"`
	Tpm int `json:"tpm"`
	User string `json:"user"`
}
